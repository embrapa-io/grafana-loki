/**
 * Token Revocation — POST /oauth/revoke
 *
 * Revoga access ou refresh tokens.
 * Sempre retorna 200 (conforme RFC 7009).
 */

import { Router, type Request, type Response } from 'express';
import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import {
    findAccessToken,
    deleteAccessToken,
    deleteRefreshTokensByAccessToken,
    findRefreshToken,
    deleteRefreshToken,
} from '../db/queries.js';

export interface CreateRevokeRouterOptions {
    db: Database.Database;
    logger: Logger;
}

export function createRevokeRouter({
    db,
    logger,
}: CreateRevokeRouterOptions): Router {
    const router = Router();

    router.post('/oauth/revoke', (req: Request, res: Response) => {
        const { token, token_type_hint } = req.body as Record<
            string,
            string | undefined
        >;

        if (!token) {
            res.status(400).json({
                error: 'invalid_request',
                error_description: 'token é obrigatório',
            });
            return;
        }

        if (!token_type_hint || token_type_hint === 'access_token') {
            const accessToken = findAccessToken(db, token);
            if (accessToken) {
                deleteRefreshTokensByAccessToken(db, token);
                deleteAccessToken(db, token);
                logger.info({ token_type: 'access_token' }, 'Token revogado');
                res.json({ revoked: true });
                return;
            }
        }

        if (!token_type_hint || token_type_hint === 'refresh_token') {
            const refreshToken = findRefreshToken(db, token);
            if (refreshToken) {
                deleteRefreshToken(db, token);
                logger.info({ token_type: 'refresh_token' }, 'Token revogado');
                res.json({ revoked: true });
                return;
            }
        }

        res.json({ revoked: true });
    });

    return router;
}
