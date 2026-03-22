/**
 * Authorization Endpoint — GET /oauth/authorize
 *
 * Valida parâmetros OAuth, cria sessão e redireciona para tela de login.
 */

import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import { findClientById, insertSession } from '../db/queries.js';
import { validateCodeChallenge } from './pkce.js';

const SESSION_TTL_MS = 10 * 60 * 1000;

export interface CreateAuthorizeRouterOptions {
    db: Database.Database;
    logger: Logger;
}

export function createAuthorizeRouter({
    db,
    logger,
}: CreateAuthorizeRouterOptions): Router {
    const router = Router();

    router.get('/oauth/authorize', (req: Request, res: Response) => {
        const {
            response_type,
            client_id,
            redirect_uri,
            code_challenge,
            code_challenge_method,
            state,
            scope,
        } = req.query as Record<string, string | undefined>;

        if (response_type !== 'code') {
            res.status(400).json({
                error: 'unsupported_response_type',
                error_description: 'response_type deve ser "code"',
            });
            return;
        }

        if (!client_id || !redirect_uri) {
            res.status(400).json({
                error: 'invalid_request',
                error_description: 'client_id e redirect_uri são obrigatórios',
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

        const registeredUris = JSON.parse(client.redirect_uris) as string[];
        if (!registeredUris.includes(redirect_uri)) {
            res.status(400).json({
                error: 'invalid_redirect_uri',
                error_description: 'redirect_uri não corresponde ao registrado',
            });
            return;
        }

        if (!code_challenge || !code_challenge_method) {
            res.status(400).json({
                error: 'invalid_request',
                error_description: 'code_challenge e code_challenge_method são obrigatórios',
            });
            return;
        }

        if (!validateCodeChallenge(code_challenge_method)) {
            res.status(400).json({
                error: 'invalid_request',
                error_description: 'code_challenge_method deve ser S256',
            });
            return;
        }

        const sessionId = randomUUID();
        const authorizationCode = randomUUID();
        const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

        insertSession(db, {
            id: sessionId,
            code: authorizationCode,
            code_challenge,
            code_challenge_method,
            client_id,
            redirect_uri,
            state: state ?? null,
            scope: scope ?? 'mcp:full',
            expires_at: expiresAt,
        });

        logger.info(
            { session_id: sessionId, client_id },
            'Sessão OAuth criada, redirecionando para login'
        );

        res.redirect(`/oauth/login?session_id=${sessionId}`);
    });

    return router;
}
