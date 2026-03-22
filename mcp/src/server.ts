/**
 * Factory do Express app.
 *
 * Configura middlewares base (helmet, cors, rate-limit, logging)
 * e monta rotas OAuth.
 */

import { randomUUID } from 'node:crypto';
import express, {
    type Express,
    type Request,
    type Response,
    type NextFunction,
} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import type { Logger } from 'pino';
import type Database from 'better-sqlite3';
import type { Redis } from 'ioredis';
import type { EnvConfig } from './config/env.js';
import { createMetadataRouter } from './oauth/metadata.js';
import { createDcrRouter } from './oauth/dcr.js';
import { createAuthorizeRouter } from './oauth/authorize.js';
import { createLoginRouter } from './oauth/login.js';
import { createTokenRouter } from './oauth/token.js';
import { createRevokeRouter } from './oauth/revoke.js';

export interface CreateAppOptions {
    config: EnvConfig;
    logger: Logger;
    db: Database.Database;
    redis: Redis;
}

export function createApp({ config, logger, db, redis }: CreateAppOptions): Express {
    const app = express();

    app.disable('x-powered-by');
    app.set('trust proxy', 1);

    // Helmet — Headers de segurança
    const isDev = config.NODE_ENV === 'development';
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:'],
                    connectSrc: ["'self'"],
                    formAction: ["'self'"],
                    frameSrc: ["'none'"],
                    objectSrc: ["'none'"],
                    upgradeInsecureRequests: isDev ? null : [],
                },
            },
            strictTransportSecurity: isDev ? false : undefined,
        })
    );

    // CORS — Configurável via MCP_CORS_ORIGINS
    const allowedOrigins = config.MCP_CORS_ORIGINS
        ? config.MCP_CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
        : [config.MCP_SERVER_URL];

    if (isDev) {
        allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
    }

    app.use(
        cors({
            origin: allowedOrigins,
            credentials: true,
        })
    );

    // Rate limiting
    app.use(
        rateLimit({
            windowMs: 60 * 1000,
            max: 200,
            standardHeaders: true,
            legacyHeaders: false,
        })
    );

    // JSON body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Logging estruturado por request
    app.use((req: Request, res: Response, next: NextFunction) => {
        const requestId = randomUUID();
        const start = Date.now();

        req.headers['x-request-id'] = requestId;
        res.setHeader('x-request-id', requestId);

        res.on('finish', () => {
            const duration = Date.now() - start;
            // Não loga health checks
            if (req.path === '/health') return;

            logger.info(
                {
                    request_id: requestId,
                    method: req.method,
                    path: req.path,
                    status: res.statusCode,
                    duration_ms: duration,
                },
                `${req.method} ${req.path} ${res.statusCode}`
            );
        });

        next();
    });

    // Servir assets estáticos do login
    app.use('/oauth/assets', express.static('dist/oauth/views/assets', {
        maxAge: '7d',
        immutable: true,
    }));

    // Montar rotas OAuth
    app.use(createMetadataRouter(config));
    app.use(createDcrRouter({ db, logger }));
    app.use(createAuthorizeRouter({ db, logger }));
    app.use(createLoginRouter({ db, redis, logger, config }));
    app.use(createTokenRouter({ db, logger, config }));
    app.use(createRevokeRouter({ db, logger }));

    logger.info({ env: config.NODE_ENV }, 'Aplicação Express configurada');

    return app;
}
