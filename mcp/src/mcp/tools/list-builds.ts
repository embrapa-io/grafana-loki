/**
 * MCP Tool: list_builds
 *
 * Lista as aplicações e stages de deploy de um projeto específico com logs no Loki.
 */

import * as z from 'zod/v4';
import type { McpServer } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';
import type { LokiClient } from '../../loki/client.js';
import type { ScopeResolver } from '../../scope/resolver.js';
import { getAuth } from './helpers.js';

export interface RegisterListBuildsOptions {
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    logger: Logger;
}

export function registerListBuildsTools(
    server: McpServer,
    { lokiClient, scopeResolver, logger }: RegisterListBuildsOptions
): void {
    server.registerTool(
        'list_builds',
        {
            title: 'Listar Builds',
            description:
                'Lista as aplicações e stages de deploy de um projeto específico que possuem logs disponíveis no Loki.',
            inputSchema: z.object({
                project: z.string().describe('Slug do projeto (ex: "meu-projeto")'),
            }),
        },
        async ({ project }, ctx) => {
            const auth = getAuth(ctx as Record<string, unknown>);
            const projects = await scopeResolver.resolveProjects(auth.backendJwt);
            scopeResolver.assertProjectAccess(project, projects);

            const builds = await scopeResolver.resolveLokiBuilds(lokiClient, project);

            logger.info(
                { audit: true, userId: auth.email, tool: 'list_builds', params: { project }, resultCount: builds.length },
                'list_builds executado'
            );

            return {
                content: [{ type: 'text' as const, text: JSON.stringify({ project, builds }, null, 2) }],
            };
        }
    );
}
