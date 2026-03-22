/**
 * Entry point do Embrapa I/O MCP Loki Server.
 *
 * Carrega configuração, inicializa logger, banco de dados,
 * Valkey, Loki client, scope resolver e inicia o servidor HTTP.
 */

import { Redis } from 'ioredis';
import pino from 'pino';
import { loadConfig } from './config/env.js';
import { createApp } from './server.js';
import { initDatabase } from './db/index.js';
import { startCleanupJob } from './db/cleanup.js';
import { setupMcpServer } from './mcp/server.js';
import { ValkeyEventStore } from './mcp/event-store.js';
import { LokiClient } from './loki/client.js';
import { ScopeResolver } from './scope/resolver.js';

const PORT = 3000;
const DB_PATH = '/data/mcp-oauth.db';

// Carrega e valida variáveis de ambiente
const config = loadConfig();

// Inicializa logger estruturado (Pino)
const logger = pino({
    level: config.LOG_LEVEL,
    ...(config.NODE_ENV === 'development' && {
        transport: {
            target: 'pino-pretty',
            options: { colorize: true },
        },
    }),
});

// Inicializa banco de dados SQLite
const db = initDatabase({ dbPath: DB_PATH, logger });

// Cria aplicação Express
const app = createApp({ config, logger, db });

// Inicializa Valkey EventStore para persistência de sessões MCP
const eventStore = new ValkeyEventStore({ redisUrl: config.VALKEY_URL, logger });

// Inicializa Loki Client
const lokiClient = new LokiClient(config.LOKI_URL, logger);

// Inicializa Redis para cache de escopo
const redis = new Redis(config.VALKEY_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => Math.min(times * 100, 3000),
});

// Inicializa Scope Resolver
const scopeResolver = new ScopeResolver({
    redis,
    backendApiUrl: config.BACKEND_API_URL,
    lokiLabelName: config.LOKI_LABEL_NAME,
    logger,
});

// Configura MCP Server com Streamable HTTP + SSE transports
setupMcpServer({ app, config, logger, db, lokiClient, scopeResolver, eventStore });

// Inicia job de cleanup de tokens expirados
startCleanupJob({
    db,
    logger,
    intervalMs: config.CLEANUP_INTERVAL_MS,
});

// Inicia o servidor HTTP
app.listen(PORT, () => {
    logger.info(
        {
            port: PORT,
            env: config.NODE_ENV,
            lokiUrl: config.LOKI_URL,
            backendUrl: config.BACKEND_API_URL,
            mcpServerUrl: config.MCP_SERVER_URL,
        },
        `Embrapa I/O MCP Loki Server iniciado na porta ${PORT}`
    );
});
