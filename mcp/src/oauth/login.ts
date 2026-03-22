/**
 * Rotas de Login OAuth — GET /oauth/login e POST /oauth/login
 *
 * GET: Renderiza a tela de login (email ou PIN)
 * POST: Processa steps do fluxo OTP (request_pin, verify_pin)
 *
 * Endpoints do backend Embrapa I/O:
 *   POST /auth/pin    — solicita envio de OTP por e-mail
 *   POST /auth/verify — verifica OTP e retorna JWT
 */

import { Router, type Request, type Response } from 'express';
import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import type { EnvConfig } from '../config/env.js';
import {
    findSessionById,
    updateSessionJwt,
    markSessionUsed,
} from '../db/queries.js';
import { renderLoginPage, renderSuccessPage, type LoginPageOptions } from './views/login.js';

const MAX_PIN_ATTEMPTS = 5;

export interface CreateLoginRouterOptions {
    db: Database.Database;
    logger: Logger;
    config: EnvConfig;
}

export function createLoginRouter({
    db,
    logger,
    config,
}: CreateLoginRouterOptions): Router {
    const router = Router();

    const renderLogin = (opts: LoginPageOptions) => renderLoginPage(opts);

    // Contador de tentativas por sessão (em memória)
    const pinAttempts = new Map<string, number>();

    // GET /oauth/login — Renderiza a tela de login
    router.get('/oauth/login', (req: Request, res: Response) => {
        const sessionId = req.query['session_id'] as string | undefined;

        if (!sessionId) {
            res.status(400).send('session_id ausente');
            return;
        }

        const session = findSessionById(db, sessionId);
        if (!session) {
            res.status(400).send('Sessão não encontrada');
            return;
        }

        if (new Date(session.expires_at) < new Date()) {
            res.status(400).send('Sessão expirada');
            return;
        }

        res.type('html').send(
            renderLogin({ sessionId, step: 'email' })
        );
    });

    // POST /oauth/login — Processa steps do fluxo OTP
    router.post('/oauth/login', async (req: Request, res: Response) => {
        const { session_id, step, email, pin } = req.body as Record<
            string,
            string | undefined
        >;

        if (!session_id) {
            res.status(400).send('session_id ausente');
            return;
        }

        const session = findSessionById(db, session_id);
        if (!session) {
            res.status(400).send('Sessão não encontrada');
            return;
        }

        if (new Date(session.expires_at) < new Date()) {
            res.status(400).send('Sessão expirada');
            return;
        }

        if (session.used) {
            res.status(400).send('Sessão já utilizada');
            return;
        }

        // Step: request_pin — Solicita envio de OTP por e-mail
        if (step === 'request_pin') {
            if (!email) {
                res.type('html').send(
                    renderLogin({
                        sessionId: session_id,
                        step: 'email',
                        error: 'E-mail é obrigatório',
                    })
                );
                return;
            }

            try {
                const backendResponse = await fetch(
                    `${config.BACKEND_API_URL}/auth/pin`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    }
                );

                if (!backendResponse.ok) {
                    logger.warn(
                        { email, status: backendResponse.status },
                        'Backend rejeitou solicitação de PIN'
                    );
                    res.type('html').send(
                        renderLogin({
                            sessionId: session_id,
                            step: 'email',
                            error: 'Não foi possível enviar o código. Verifique o e-mail.',
                        })
                    );
                    return;
                }

                logger.info({ email }, 'PIN OTP solicitado ao backend');

                res.type('html').send(
                    renderLogin({
                        sessionId: session_id,
                        step: 'pin',
                        email,
                    })
                );
            } catch (err) {
                logger.error({ err }, 'Erro ao solicitar PIN ao backend');
                res.type('html').send(
                    renderLogin({
                        sessionId: session_id,
                        step: 'email',
                        error: 'Erro de comunicação com o servidor. Tente novamente.',
                    })
                );
            }
            return;
        }

        // Step: verify_pin — Verifica o OTP e obtém JWT
        if (step === 'verify_pin') {
            if (!email || !pin) {
                res.type('html').send(
                    renderLogin({
                        sessionId: session_id,
                        step: 'pin',
                        email,
                        error: 'E-mail e código são obrigatórios',
                    })
                );
                return;
            }

            const attempts = pinAttempts.get(session_id) ?? 0;
            if (attempts >= MAX_PIN_ATTEMPTS) {
                markSessionUsed(db, session_id);
                res.status(400).send(
                    'Número máximo de tentativas excedido. Inicie o login novamente.'
                );
                return;
            }
            pinAttempts.set(session_id, attempts + 1);

            try {
                const authResponse = await fetch(
                    `${config.BACKEND_API_URL}/auth/verify`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, pin }),
                    }
                );

                if (!authResponse.ok) {
                    logger.warn(
                        { email, attempt: attempts + 1 },
                        'Autenticação falhou — PIN inválido'
                    );
                    res.type('html').send(
                        renderLogin({
                            sessionId: session_id,
                            step: 'pin',
                            email,
                            error: 'Código inválido. Tente novamente.',
                        })
                    );
                    return;
                }

                const authData = (await authResponse.json()) as {
                    token: string;
                    expiresAt?: string;
                };

                // Decodifica expiração do JWT
                let jwtExpiresAt: string;
                if (authData.expiresAt) {
                    jwtExpiresAt = authData.expiresAt;
                } else {
                    try {
                        const payload = JSON.parse(
                            Buffer.from(
                                authData.token.split('.')[1]!,
                                'base64url'
                            ).toString()
                        ) as { exp?: number };
                        jwtExpiresAt = payload.exp
                            ? new Date(payload.exp * 1000).toISOString()
                            : new Date(
                                  Date.now() + 30 * 24 * 60 * 60 * 1000
                              ).toISOString();
                    } catch {
                        jwtExpiresAt = new Date(
                            Date.now() + 30 * 24 * 60 * 60 * 1000
                        ).toISOString();
                    }
                }

                // Atualiza sessão com JWT
                updateSessionJwt(db, session_id, authData.token, jwtExpiresAt);

                logger.info({ email }, 'Autenticação OTP concluída');

                // Limpa contador de tentativas
                pinAttempts.delete(session_id);

                // Redireciona de volta ao cliente com authorization code
                const redirectUri = session.redirect_uri;
                const params = new URLSearchParams({
                    code: session.code,
                });
                if (session.state) {
                    params.set('state', session.state);
                }

                res.type('html').send(renderSuccessPage(redirectUri, params.toString()));
            } catch (err) {
                logger.error({ err }, 'Erro ao verificar PIN');
                res.type('html').send(
                    renderLogin({
                        sessionId: session_id,
                        step: 'pin',
                        email,
                        error: 'Erro de comunicação com o servidor. Tente novamente.',
                    })
                );
            }
            return;
        }

        res.status(400).send('Step inválido');
    });

    return router;
}
