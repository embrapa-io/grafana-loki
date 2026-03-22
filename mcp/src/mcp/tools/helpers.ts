/**
 * Helpers compartilhados pelas MCP tools.
 */

import type { McpAuthInfo } from '../auth.js';

/**
 * Extrai informações de autenticação do contexto MCP.
 * O auth info vive em ctx.http?.authInfo e precisa de cast.
 */
export function getAuth(ctx: Record<string, unknown>): McpAuthInfo {
    const http = ctx.http as { authInfo?: McpAuthInfo } | undefined;
    if (!http?.authInfo) {
        throw new Error('Não autenticado — auth info ausente no contexto MCP');
    }
    return http.authInfo;
}
