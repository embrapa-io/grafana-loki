/**
 * MCP Tool: tail_logs
 *
 * Exibe as linhas de log mais recentes de um projeto (tail).
 * Atalho para query_logs com direction=backward e limite pequeno.
 */

import * as z from 'zod/v4';
import type { McpServer } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';
import type { EnvConfig } from '../../config/env.js';
import { LokiClient, formatLogEntries } from '../../loki/client.js';
import type { ScopeResolver } from '../../scope/resolver.js';
import { buildLogQL, sinceToStartTime } from '../../loki/query-builder.js';
import { getAuth } from './helpers.js';

export interface RegisterTailLogsOptions {
    config: EnvConfig;
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    logger: Logger;
}

export function registerTailLogsTools(
    server: McpServer,
    { config, lokiClient, scopeResolver, logger }: RegisterTailLogsOptions
): void {
    server.registerTool(
        'tail_logs',
        {
            title: 'Últimos Logs',
            description:
                'Exibe as linhas de log mais recentes de um projeto (equivalente a "tail"). Útil para verificar rapidamente o que está acontecendo em tempo real.',
            inputSchema: z.object({
                project: z.string().describe('Slug do projeto'),
                app: z.string().optional().describe('Nome da aplicação (opcional)'),
                stage: z.enum(['alpha', 'beta', 'release']).optional().describe('Stage de deploy (opcional)'),
                lines: z.number().int().min(1).max(200).optional().describe('Número de linhas (padrão: 50)'),
                max_per_line: z.number().int().min(10).max(1000).optional().describe('Máximo de caracteres por linha (padrão: 100)'),
            }),
        },
        async (params, ctx) => {
            const auth = getAuth(ctx as Record<string, unknown>);
            const projects = await scopeResolver.resolveProjects(auth.backendJwt);
            scopeResolver.assertProjectAccess(params.project, projects);

            const limit = params.lines ?? 50;
            const maxPerLine = params.max_per_line ?? 100;

            const logql = buildLogQL({
                project: params.project,
                app: params.app,
                stage: params.stage ?? 'release',
                labelName: config.LOKI_LABEL_NAME,
            });

            const start = Date.now();
            const response = await lokiClient.queryRange({
                query: logql,
                start: sinceToStartTime('1h'),
                limit,
                direction: 'backward',
            });
            const durationMs = Date.now() - start;

            const entries = formatLogEntries(response, maxPerLine);

            logger.info(
                {
                    audit: true,
                    userId: auth.email,
                    tool: 'tail_logs',
                    params: { project: params.project, app: params.app, stage: params.stage },
                    logqlGenerated: logql,
                    resultCount: entries.length,
                    durationMs,
                },
                'tail_logs executado'
            );

            const result = {
                query_info: { logql, since: '1h', limit, direction: 'backward' },
                total_lines: entries.length,
                logs: entries,
            };

            return {
                content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
        }
    );
}
