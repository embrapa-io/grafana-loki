/**
 * Setup do McpServer com transports e registro de tools.
 *
 * Configura o McpServer do SDK, registra as 6 tools de logs,
 * e monta dual transport (Streamable HTTP + SSE legado) no Express.
 *
 * Endpoints:
 *   POST/GET/DELETE /mcp — Streamable HTTP transport
 *   GET /sse            — SSE legacy connect
 *   POST /messages      — SSE legacy messages
 */

import { randomUUID } from 'node:crypto';
import type { Express, Request, Response } from 'express';
import type { AuthInfo } from '@modelcontextprotocol/server';
import {
    McpServer,
    isInitializeRequest,
} from '@modelcontextprotocol/server';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import type { Logger } from 'pino';
import type Database from 'better-sqlite3';
import type { EnvConfig } from '../config/env.js';
import type { LokiClient } from '../loki/client.js';
import type { ScopeResolver } from '../scope/resolver.js';
import { createMcpAuthMiddleware } from './auth.js';
import { ValkeyEventStore } from './event-store.js';
import { SSEServerTransport } from './transport/sse.js';
import { registerListProjectsTools } from './tools/list-projects.js';
import { registerListBuildsTools } from './tools/list-builds.js';
import { registerQueryLogsTools } from './tools/query-logs.js';
import { registerTailLogsTools } from './tools/tail-logs.js';
import { registerSearchErrorsTools } from './tools/search-errors.js';
import { registerLogStatsTools } from './tools/log-stats.js';

const sessions = new Map<string, NodeStreamableHTTPServerTransport>();
const sseSessions = new Map<string, SSEServerTransport>();

export interface SetupMcpOptions {
    app: Express;
    config: EnvConfig;
    logger: Logger;
    db: Database.Database;
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    eventStore?: ValkeyEventStore;
}

export function setupMcpServer({
    app,
    config,
    logger,
    db,
    lokiClient,
    scopeResolver,
    eventStore,
}: SetupMcpOptions): McpServer {
    const getServer = () => {
        const server = new McpServer(
            {
                name: 'embrapa-io-mcp-loki',
                version: '0.1.0',
            },
            {
                capabilities: {
                    logging: {},
                },
            }
        );

        const toolDeps = { config, lokiClient, scopeResolver, logger };

        registerListProjectsTools(server, toolDeps);
        registerListBuildsTools(server, toolDeps);
        registerQueryLogsTools(server, toolDeps);
        registerTailLogsTools(server, toolDeps);
        registerSearchErrorsTools(server, toolDeps);
        registerLogStatsTools(server, toolDeps);

        return server;
    };

    // Auth middleware para endpoints MCP
    const authMiddleware = createMcpAuthMiddleware({ db, logger, config });

    // Health check
    app.get('/health', (_req: Request, res: Response) => {
        res.json({ status: 'ok' });
    });

    // POST /mcp — Streamable HTTP (novo request ou sessão existente)
    app.post('/mcp', authMiddleware, async (req: Request, res: Response) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;

        if (sessionId && sessions.has(sessionId)) {
            const transport = sessions.get(sessionId)!;
            await transport.handleRequest(req, res, req.body);
            return;
        }

        if (isInitializeRequest(req.body)) {
            const transport = new NodeStreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                eventStore,
            });

            const server = getServer();
            server.connect(transport);

            await transport.handleRequest(req, res, req.body);

            if (transport.sessionId) {
                sessions.set(transport.sessionId, transport);
                logger.info(
                    { session_id: transport.sessionId },
                    'Nova sessão MCP iniciada'
                );
            }
            return;
        }

        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32600,
                message: 'Sessão MCP inválida. Envie initialize request primeiro.',
            },
            id: null,
        });
    });

    // GET /mcp — SSE stream para notificações (Streamable HTTP)
    app.get('/mcp', authMiddleware, async (req: Request, res: Response) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;

        if (!sessionId || !sessions.has(sessionId)) {
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Sessão MCP não encontrada.',
                },
                id: null,
            });
            return;
        }

        const transport = sessions.get(sessionId)!;
        await transport.handleRequest(req, res);
    });

    // DELETE /mcp — Encerrar sessão (Streamable HTTP)
    app.delete('/mcp', authMiddleware, async (req: Request, res: Response) => {
        const sessionId = req.headers['mcp-session-id'] as string | undefined;

        if (sessionId && sessions.has(sessionId)) {
            const transport = sessions.get(sessionId)!;
            await transport.handleRequest(req, res);
            sessions.delete(sessionId);
            logger.info({ session_id: sessionId }, 'Sessão MCP encerrada');
            return;
        }

        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32600,
                message: 'Sessão MCP não encontrada.',
            },
            id: null,
        });
    });

    // GET /sse — SSE legado
    app.get('/sse', authMiddleware, (req: Request, res: Response) => {
        const transport = new SSEServerTransport({
            baseUrl: config.MCP_SERVER_URL,
        });

        const server = getServer();
        server.connect(transport);

        transport.onclose = () => {
            sseSessions.delete(transport.sessionId);
            logger.info({ session_id: transport.sessionId }, 'Sessão SSE legado encerrada');
        };

        sseSessions.set(transport.sessionId, transport);
        logger.info({ session_id: transport.sessionId }, 'Nova sessão SSE legado iniciada');

        transport.handleSseRequest(req as Request & { auth?: AuthInfo }, res);
    });

    // POST /messages — Recebe mensagens JSON-RPC de clientes SSE
    app.post('/messages', authMiddleware, (req: Request, res: Response) => {
        const sessionId = req.query.sessionId as string | undefined;

        if (!sessionId || !sseSessions.has(sessionId)) {
            res.status(400).json({
                jsonrpc: '2.0',
                error: {
                    code: -32600,
                    message: 'Sessão SSE não encontrada. Faça GET /sse primeiro.',
                },
                id: null,
            });
            return;
        }

        const transport = sseSessions.get(sessionId)!;
        transport.handleMessageRequest(
            req as Request & { auth?: AuthInfo },
            res,
            req.body
        );
    });

    logger.info('McpServer configurado com Streamable HTTP (/mcp) e SSE legado (/sse + /messages)');

    return getServer();
}
