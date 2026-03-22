/**
 * Token Endpoint — POST /oauth/token
 *
 * Troca authorization code por access/refresh tokens (grant_type=authorization_code)
 * e renova tokens via refresh (grant_type=refresh_token).
 */

import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import type { EnvConfig } from '../config/env.js';
import { verifyCodeVerifier } from './pkce.js';
import {
    findClientById,
    findSessionByCode,
    markSessionUsed,
    insertAccessToken,
    insertRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    deleteAccessToken,
    deleteRefreshTokensByAccessToken,
} from '../db/queries.js';

export interface CreateTokenRouterOptions {
    db: Database.Database;
    logger: Logger;
    config: EnvConfig;
}

export function createTokenRouter({
    db,
    logger,
    config,
}: CreateTokenRouterOptions): Router {
    const router = Router();

    router.post('/oauth/token', (req: Request, res: Response) => {
        const { grant_type } = req.body as Record<string, string | undefined>;

        if (grant_type === 'authorization_code') {
            handleAuthorizationCodeGrant(req, res, db, logger, config);
            return;
        }

        if (grant_type === 'refresh_token') {
            handleRefreshTokenGrant(req, res, db, logger, config);
            return;
        }

        res.status(400).json({
            error: 'unsupported_grant_type',
            error_description: 'grant_type deve ser authorization_code ou refresh_token',
        });
    });

    return router;
}

function handleAuthorizationCodeGrant(
    req: Request,
    res: Response,
    db: Database.Database,
    logger: Logger,
    config: EnvConfig
): void {
    const { code, redirect_uri, client_id, code_verifier } = req.body as Record<
        string,
        string | undefined
    >;

    if (!code || !redirect_uri || !client_id || !code_verifier) {
        res.status(400).json({
            error: 'invalid_request',
            error_description:
                'Parâmetros obrigatórios: code, redirect_uri, client_id, code_verifier',
        });
        return;
    }

    const client = findClientById(db, client_id);
    if (!client) {
        res.status(400).json({
            error: 'invalid_client',
            error_description: 'client_id não encontrado',
        });
        return;
    }

    const session = findSessionByCode(db, code);
    if (!session) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Authorization code inválido',
        });
        return;
    }

    if (session.used) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Authorization code já utilizado',
        });
        return;
    }

    if (new Date(session.expires_at) < new Date()) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Authorization code expirado',
        });
        return;
    }

    if (session.client_id !== client_id || session.redirect_uri !== redirect_uri) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'client_id ou redirect_uri não correspondem',
        });
        return;
    }

    if (!verifyCodeVerifier(code_verifier, session.code_challenge)) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'code_verifier inválido (PKCE)',
        });
        return;
    }

    if (!session.user_jwt || !session.jwt_expires_at) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Autenticação não completada',
        });
        return;
    }

    // Atomic: marca sessão como usada com WHERE used = 0 para evitar race condition
    const markResult = db.prepare(
        `UPDATE oauth_sessions SET used = 1 WHERE id = ? AND used = 0`
    ).run(session.id);

    if (markResult.changes === 0) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Authorization code já utilizado (concorrência)',
        });
        return;
    }

    const accessToken = randomUUID();
    const refreshToken = randomUUID();
    const now = Date.now();
    const accessExpiresAt = new Date(
        now + config.ACCESS_TOKEN_TTL * 1000
    ).toISOString();
    const refreshExpiresAt = new Date(
        now + config.REFRESH_TOKEN_TTL * 1000
    ).toISOString();

    let userEmail = 'unknown';
    try {
        const payload = JSON.parse(
            Buffer.from(session.user_jwt.split('.')[1]!, 'base64url').toString()
        ) as { email?: string };
        userEmail = payload.email ?? 'unknown';
    } catch {
        // mantém 'unknown'
    }

    // Transação atômica para inserção de tokens
    const issueTokens = db.transaction(() => {
        insertAccessToken(db, {
            token: accessToken,
            client_id,
            user_jwt: session.user_jwt,
            jwt_expires_at: session.jwt_expires_at,
            user_email: userEmail,
            scope: session.scope,
            expires_at: accessExpiresAt,
        });

        insertRefreshToken(db, {
            token: refreshToken,
            client_id,
            access_token: accessToken,
            user_jwt: session.user_jwt,
            jwt_expires_at: session.jwt_expires_at,
            user_email: userEmail,
            scope: session.scope,
            expires_at: refreshExpiresAt,
        });
    });

    issueTokens();

    logger.info(
        { client_id, user_email: userEmail },
        'Tokens emitidos via authorization_code grant'
    );

    res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: config.ACCESS_TOKEN_TTL,
        refresh_token: refreshToken,
        scope: session.scope,
    });
}

function handleRefreshTokenGrant(
    req: Request,
    res: Response,
    db: Database.Database,
    logger: Logger,
    config: EnvConfig
): void {
    const { refresh_token, client_id } = req.body as Record<
        string,
        string | undefined
    >;

    if (!refresh_token || !client_id) {
        res.status(400).json({
            error: 'invalid_request',
            error_description: 'Parâmetros obrigatórios: refresh_token, client_id',
        });
        return;
    }

    const client = findClientById(db, client_id);
    if (!client) {
        res.status(400).json({
            error: 'invalid_client',
            error_description: 'client_id não encontrado',
        });
        return;
    }

    const storedRefresh = findRefreshToken(db, refresh_token);
    if (!storedRefresh) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Refresh token inválido',
        });
        return;
    }

    if (storedRefresh.client_id !== client_id) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Refresh token não pertence ao cliente',
        });
        return;
    }

    if (new Date(storedRefresh.expires_at) < new Date()) {
        deleteRefreshToken(db, refresh_token);
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Refresh token expirado',
        });
        return;
    }

    if (new Date(storedRefresh.jwt_expires_at) < new Date()) {
        deleteRefreshToken(db, refresh_token);
        deleteAccessToken(db, storedRefresh.access_token);
        res.status(401).json({
            error: 'expired_jwt',
            error_description: 'JWT do backend expirou — re-autenticação necessária',
        });
        return;
    }

    // Atomic: deleta refresh token com WHERE para evitar race condition
    const deleteResult = db.prepare(
        `DELETE FROM refresh_tokens WHERE token = ?`
    ).run(refresh_token);

    if (deleteResult.changes === 0) {
        res.status(400).json({
            error: 'invalid_grant',
            error_description: 'Refresh token já consumido (concorrência)',
        });
        return;
    }

    deleteAccessToken(db, storedRefresh.access_token);

    const newAccessToken = randomUUID();
    const newRefreshToken = randomUUID();
    const now = Date.now();
    const accessExpiresAt = new Date(
        now + config.ACCESS_TOKEN_TTL * 1000
    ).toISOString();
    const refreshExpiresAt = new Date(
        now + config.REFRESH_TOKEN_TTL * 1000
    ).toISOString();

    // Transação atômica para rotação de tokens
    const rotateTokens = db.transaction(() => {
        insertAccessToken(db, {
            token: newAccessToken,
            client_id,
            user_jwt: storedRefresh.user_jwt,
            jwt_expires_at: storedRefresh.jwt_expires_at,
            user_email: storedRefresh.user_email,
            scope: storedRefresh.scope,
            expires_at: accessExpiresAt,
        });

        insertRefreshToken(db, {
            token: newRefreshToken,
            client_id,
            access_token: newAccessToken,
            user_jwt: storedRefresh.user_jwt,
            jwt_expires_at: storedRefresh.jwt_expires_at,
            user_email: storedRefresh.user_email,
            scope: storedRefresh.scope,
            expires_at: refreshExpiresAt,
        });
    });

    rotateTokens();

    logger.info(
        { client_id, user_email: storedRefresh.user_email },
        'Tokens renovados via refresh_token grant (rotação)'
    );

    res.json({
        access_token: newAccessToken,
        token_type: 'Bearer',
        expires_in: config.ACCESS_TOKEN_TTL,
        refresh_token: newRefreshToken,
        scope: storedRefresh.scope,
    });
}
