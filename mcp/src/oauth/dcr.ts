/**
 * Dynamic Client Registration (DCR) — POST /oauth/register
 */

import { randomUUID } from 'node:crypto';
import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import { insertClient } from '../db/queries.js';

const dcrRequestSchema = z.object({
    client_name: z.string().min(1, 'client_name é obrigatório'),
    redirect_uris: z
        .array(z.string().url('Cada redirect_uri deve ser uma URL válida'))
        .min(1, 'redirect_uris deve conter ao menos uma URI'),
});

export interface CreateDcrRouterOptions {
    db: Database.Database;
    logger: Logger;
}

export function createDcrRouter({ db, logger }: CreateDcrRouterOptions): Router {
    const router = Router();

    router.post('/oauth/register', (req: Request, res: Response) => {
        const parsed = dcrRequestSchema.safeParse(req.body);

        if (!parsed.success) {
            const mensagem = parsed.error.issues
                .map((i) => i.message)
                .join('; ');

            res.status(400).json({
                error: 'invalid_request',
                error_description: mensagem,
            });
            return;
        }

        const { client_name, redirect_uris } = parsed.data;
        const clientId = randomUUID();

        try {
            insertClient(db, {
                client_id: clientId,
                client_name,
                redirect_uris: JSON.stringify(redirect_uris),
            });
        } catch (err) {
            logger.error({ err }, 'Erro ao registrar cliente OAuth');
            res.status(500).json({
                error: 'server_error',
                error_description: 'Erro interno ao registrar cliente',
            });
            return;
        }

        logger.info(
            { client_id: clientId, client_name },
            'Cliente OAuth registrado via DCR'
        );

        res.status(201).json({
            client_id: clientId,
            client_name,
            redirect_uris,
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            token_endpoint_auth_method: 'none',
        });
    });

    return router;
}
