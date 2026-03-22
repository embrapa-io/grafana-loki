/**
 * Middleware de autenticação MCP.
 *
 * Extrai o Bearer token do header Authorization,
 * busca o access_token no SQLite e resolve o JWT do backend.
 */

import type { Request, Response, NextFunction } from 'express';
import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import type { EnvConfig } from '../config/env.js';
import { findAccessToken } from '../db/queries.js';

const EMBRAPA_DOMAINS = ['@embrapa.br', '@colaborador.embrapa.br'];

export function isEmbrapaEmail(email: string): boolean {
    return EMBRAPA_DOMAINS.some((d) => email.toLowerCase().endsWith(d));
}

/** Informações de autenticação disponíveis nos handlers MCP */
export interface McpAuthInfo {
    token: string;
    email: string;
    backendJwt: string;
    isEmbrapa: boolean;
}

export interface CreateAuthMiddlewareOptions {
    db: Database.Database;
    logger: Logger;
    config: EnvConfig;
}

/**
 * Cria middleware Express que valida o access token
 * e resolve o JWT do backend para uso nas tools MCP.
 */
export function createMcpAuthMiddleware({
    db,
    logger,
    config,
}: CreateAuthMiddlewareOptions) {
    const send401 = (req: Request, res: Response, error: string, description: string): void => {
        const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
        const resourceMetadataUrl = `${proto}://${host}/.well-known/oauth-protected-resource`;

        res.status(401)
            .set(
                'WWW-Authenticate',
                `Bearer error="${error}", error_description="${description}", resource_metadata="${resourceMetadataUrl}"`
            )
            .json({ error, error_description: description });
    };

    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            send401(req, res, 'invalid_request', 'Bearer token ausente');
            return;
        }

        const token = authHeader.slice(7);

        // Busca o access token no SQLite
        const accessToken = findAccessToken(db, token);
        if (!accessToken) {
            send401(req, res, 'invalid_token', 'Access token inválido ou expirado');
            return;
        }

        // Verifica expiração do access token
        if (new Date(accessToken.expires_at) < new Date()) {
            send401(req, res, 'invalid_token', 'Access token expirado');
            return;
        }

        // Verifica expiração do JWT do backend
        if (new Date(accessToken.jwt_expires_at) < new Date()) {
            logger.warn(
                { user_email: accessToken.user_email },
                'JWT do backend expirado — re-autenticação necessária'
            );
            send401(req, res, 'invalid_token', 'JWT do backend expirado — re-autenticação necessária');
            return;
        }

        // Popula req.auth para uso pelo transport do SDK
        (req as Request & { auth: McpAuthInfo }).auth = {
            token,
            email: accessToken.user_email,
            backendJwt: accessToken.user_jwt,
            isEmbrapa: isEmbrapaEmail(accessToken.user_email),
        };

        next();
    };
}
