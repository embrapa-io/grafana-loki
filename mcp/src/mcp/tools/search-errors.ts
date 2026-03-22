/**
 * MCP Tool: search_errors
 *
 * Busca por erros, exceções e stack traces nos logs de um projeto.
 */

import * as z from 'zod/v4';
import type { McpServer } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';
import type { EnvConfig } from '../../config/env.js';
import { LokiClient, formatLogEntries } from '../../loki/client.js';
import type { ScopeResolver } from '../../scope/resolver.js';
import { buildErrorLogQL, sinceToStartTime } from '../../loki/query-builder.js';
import { getAuth } from './helpers.js';

export interface RegisterSearchErrorsOptions {
    config: EnvConfig;
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    logger: Logger;
}

export function registerSearchErrorsTools(
    server: McpServer,
    { config, lokiClient, scopeResolver, logger }: RegisterSearchErrorsOptions
): void {
    server.registerTool(
        'search_errors',
        {
            title: 'Buscar Erros',
            description:
                'Busca por erros, exceções e stack traces nos logs de um projeto. Útil para diagnóstico rápido de problemas. Use "pattern" para filtrar erros específicos (ex: "ECONNREFUSED", "500", "OutOfMemory").',
            inputSchema: z.object({
                project: z.string().describe('Slug do projeto'),
                app: z.string().optional().describe('Nome da aplicação (opcional)'),
                stage: z.enum(['alpha', 'beta', 'release']).optional().describe('Stage de deploy (opcional)'),
                since: z.string().optional().describe('Período de busca (ex: "1h", "24h", "7d"). Padrão: "24h"'),
                pattern: z.string().optional().describe('Padrão adicional para filtrar erros (ex: "ECONNREFUSED", "timeout")'),
                max_per_line: z.number().int().min(10).max(1000).optional().describe('Máximo de caracteres por linha (padrão: 100)'),
            }),
        },
        async (params, ctx) => {
            const auth = getAuth(ctx as Record<string, unknown>);
            const projects = await scopeResolver.resolveProjects(auth.backendJwt);
            scopeResolver.assertProjectAccess(params.project, projects);

            const since = params.since ?? '24h';
            const maxPerLine = params.max_per_line ?? 100;

            const logql = buildErrorLogQL({
                project: params.project,
                app: params.app,
                stage: params.stage,
                search: params.pattern,
                labelName: config.LOKI_LABEL_NAME,
            });

            const start = Date.now();
            const response = await lokiClient.queryRange({
                query: logql,
                start: sinceToStartTime(since),
                limit: 500,
                direction: 'backward',
            });
            const durationMs = Date.now() - start;

            const entries = formatLogEntries(response, maxPerLine);

            logger.info(
                {
                    audit: true,
                    userId: auth.email,
                    tool: 'search_errors',
                    params: { project: params.project, app: params.app, stage: params.stage, since, pattern: params.pattern },
                    logqlGenerated: logql,
                    resultCount: entries.length,
                    durationMs,
                },
                'search_errors executado'
            );

            const result = {
                query_info: { logql, since },
                error_count: entries.length,
                logs: entries,
            };

            return {
                content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
        }
    );
}
