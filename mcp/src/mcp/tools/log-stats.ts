/**
 * MCP Tool: log_stats
 *
 * Estatísticas de volume e taxa de erros dos logs de um projeto.
 */

import * as z from 'zod/v4';
import type { McpServer } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';
import type { EnvConfig } from '../../config/env.js';
import { LokiClient } from '../../loki/client.js';
import type { LokiMatrixResult } from '../../loki/types.js';
import type { ScopeResolver } from '../../scope/resolver.js';
import { buildStatsLogQL, buildErrorRateLogQL, sinceToStartTime } from '../../loki/query-builder.js';
import { getAuth } from './helpers.js';

export interface RegisterLogStatsOptions {
    config: EnvConfig;
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    logger: Logger;
}

/**
 * Soma os valores de uma resposta matrix do Loki.
 */
function sumMatrixValues(result: LokiMatrixResult[]): number {
    let total = 0;
    for (const series of result) {
        for (const [, value] of series.values) {
            total += parseFloat(value);
        }
    }
    return Math.round(total);
}

export function registerLogStatsTools(
    server: McpServer,
    { config, lokiClient, scopeResolver, logger }: RegisterLogStatsOptions
): void {
    server.registerTool(
        'log_stats',
        {
            title: 'Estatísticas de Logs',
            description:
                'Mostra estatísticas de volume e taxa de erros dos logs de um projeto. Inclui total de linhas, distribuição por stage e taxa de erros.',
            inputSchema: z.object({
                project: z.string().describe('Slug do projeto'),
                app: z.string().optional().describe('Nome da aplicação (opcional)'),
                since: z.string().optional().describe('Período de análise (ex: "1h", "24h", "7d"). Padrão: "24h"'),
            }),
        },
        async (params, ctx) => {
            const auth = getAuth(ctx as Record<string, unknown>);
            const projects = await scopeResolver.resolveProjects(auth.backendJwt);
            scopeResolver.assertProjectAccess(params.project, projects);

            const since = params.since ?? '24h';
            const startTime = sinceToStartTime(since);

            // Total de logs
            const totalQuery = buildStatsLogQL({
                project: params.project,
                app: params.app,
                since,
                labelName: config.LOKI_LABEL_NAME,
            });

            // Taxa de erros
            const errorQuery = buildErrorRateLogQL({
                project: params.project,
                app: params.app,
                since,
                labelName: config.LOKI_LABEL_NAME,
            });

            const start = Date.now();
            const [totalResponse, errorResponse] = await Promise.all([
                lokiClient.query({ query: totalQuery, start: startTime }),
                lokiClient.query({ query: errorQuery, start: startTime }),
            ]);
            const durationMs = Date.now() - start;

            const totalLines = totalResponse.data.resultType === 'matrix'
                ? sumMatrixValues(totalResponse.data.result as LokiMatrixResult[])
                : 0;

            const errorLines = errorResponse.data.resultType === 'matrix'
                ? sumMatrixValues(errorResponse.data.result as LokiMatrixResult[])
                : 0;

            const errorRate = totalLines > 0
                ? Math.round((errorLines / totalLines) * 10000) / 100
                : 0;

            // Distribuição por stage
            const stageDistribution: Record<string, number> = {};
            if (totalResponse.data.resultType === 'matrix') {
                for (const series of totalResponse.data.result as LokiMatrixResult[]) {
                    const composeProject = series.metric[config.LOKI_LABEL_NAME] ?? '';
                    const lastUnderscore = composeProject.lastIndexOf('_');
                    if (lastUnderscore !== -1) {
                        const stage = composeProject.slice(lastUnderscore + 1);
                        if (['alpha', 'beta', 'release'].includes(stage)) {
                            let seriesTotal = 0;
                            for (const [, value] of series.values) {
                                seriesTotal += parseFloat(value);
                            }
                            stageDistribution[stage] = (stageDistribution[stage] ?? 0) + Math.round(seriesTotal);
                        }
                    }
                }
            }

            logger.info(
                {
                    audit: true,
                    userId: auth.email,
                    tool: 'log_stats',
                    params: { project: params.project, app: params.app, since },
                    resultCount: totalLines,
                    durationMs,
                },
                'log_stats executado'
            );

            const result = {
                query_info: { total_query: totalQuery, error_query: errorQuery, since },
                total_lines: totalLines,
                error_lines: errorLines,
                error_rate: `${errorRate}%`,
                stage_distribution: stageDistribution,
                retention_note: 'Logs disponíveis conforme política de retenção do Loki.',
            };

            return {
                content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
            };
        }
    );
}
