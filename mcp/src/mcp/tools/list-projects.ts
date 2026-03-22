/**
 * MCP Tool: list_projects
 *
 * Lista os projetos do usuário com aplicações e stages disponíveis no Loki.
 */

import * as z from 'zod/v4';
import type { McpServer } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';
import type { LokiClient } from '../../loki/client.js';
import type { ScopeResolver } from '../../scope/resolver.js';
import { getAuth } from './helpers.js';

export interface RegisterListProjectsOptions {
    lokiClient: LokiClient;
    scopeResolver: ScopeResolver;
    logger: Logger;
}

export function registerListProjectsTools(
    server: McpServer,
    { lokiClient, scopeResolver, logger }: RegisterListProjectsOptions
): void {
    server.registerTool(
        'list_projects',
        {
            title: 'Listar Projetos',
            description:
                'Lista os projetos do Embrapa I/O aos quais você tem acesso, incluindo as aplicações e stages de deploy com logs disponíveis no Loki.',
            inputSchema: z.object({}),
        },
        async (_, ctx) => {
            const auth = getAuth(ctx as Record<string, unknown>);
            const projects = await scopeResolver.resolveProjects(auth.backendJwt);

            const result = await Promise.all(
                projects.map(async (slug) => {
                    const builds = await scopeResolver.resolveLokiBuilds(lokiClient, slug);
                    return {
                        slug,
                        apps: builds.map(b => ({
                            name: b.app,
                            stages: b.stages,
                        })),
                    };
                })
            );

            logger.info(
                { audit: true, userId: auth.email, tool: 'list_projects', resultCount: result.length },
                'list_projects executado'
            );

            return {
                content: [{ type: 'text' as const, text: JSON.stringify({ projects: result }, null, 2) }],
            };
        }
    );
}
