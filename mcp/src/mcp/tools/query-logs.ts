/**
 * MCP Tool: query_logs
 *
 * Consulta logs de um projeto no Loki com filtros opcionais.
 */

import * as z from 'zod/v4';
import type { McpServer } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';
import type { EnvConfig } from '../../config/env.js';
import { LokiClient, formatLogEntries } from '../../loki/client.js';
import type { ScopeResolver } from '../../scope/resolver.js';
import { buildLogQL, sinceToStartTime } from '../../loki/query-builder.js';
import { getAuth } from './helpers.js';

export interface RegisterQueryLogsOptions {
    config: EnvConfig;
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    logger: Logger;
}

export function registerQueryLogsTools(
    server: McpServer,
    { config, lokiClient, scopeResolver, logger }: RegisterQueryLogsOptions
): void {
    server.registerTool(
        'query_logs',
        {
            title: 'Consultar Logs',
            description:
                'Consulta logs de um projeto no Grafana Loki. Filtre por aplicação, stage, nível de log ou texto. Use "since" para definir o período (ex: "1h", "24h", "7d").',
            inputSchema: z.object({
                project: z.string().describe('Slug do projeto'),
                app: z.string().optional().describe('Nome da aplicação (opcional)'),
                stage: z.enum(['alpha', 'beta', 'release']).optional().describe('Stage de deploy (opcional)'),
                search: z.string().optional().describe('Texto para buscar nos logs (opcional)'),
                level: z.string().optional().describe('Nível de log para filtrar (ex: "ERROR", "WARN")'),
                since: z.string().optional().describe('Período de busca (ex: "1h", "24h", "7d"). Padrão: "1h"'),
                limit: z.number().int().min(1).max(1000).optional().describe('Máximo de linhas (padrão: 100)'),
                max_per_line: z.number().int().min(10).max(1000).optional().describe('Máximo de caracteres por linha (padrão: 100)'),
                direction: z.enum(['forward', 'backward']).optional().describe('Ordem temporal: "forward" (mais antigo primeiro) ou "backward" (mais recente primeiro). Padrão: "backward"'),
            }),
        },
        async (params, ctx) => {
            const auth = getAuth(ctx as Record<string, unknown>);
            const projects = await scopeResolver.resolveProjects(auth.backendJwt);
            scopeResolver.assertProjectAccess(params.project, projects);

            const since = params.since ?? '1h';
            const limit = params.limit ?? 100;
            const maxPerLine = params.max_per_line ?? 100;
            const direction = params.direction ?? 'backward';

            const logql = buildLogQL({
                project: params.project,
                app: params.app,
                stage: params.stage,
                search: params.search,
                level: params.level,
                labelName: config.LOKI_LABEL_NAME,
            });

            const start = Date.now();
            const response = await lokiClient.queryRange({
                query: logql,
                start: sinceToStartTime(since),
                limit,
                direction,
            });
            const durationMs = Date.now() - start;

            const entries = formatLogEntries(response, maxPerLine);

            logger.info(
                {
                    audit: true,
                    userId: auth.email,
                    tool: 'query_logs',
                    params: { project: params.project, app: params.app, stage: params.stage, since },
                    logqlGenerated: logql,
                    resultCount: entries.length,
                    durationMs,
                },
                'query_logs executado'
            );

            const result = {
                query_info: { logql, since, limit, direction },
                total_lines: entries.length,
                logs: entries,
            };

            return {
                content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
        }
    );
}
