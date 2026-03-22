/**
 * Metadata do Authorization Server e Protected Resource (RFC 9728, RFC 9470).
 *
 * Endpoints:
 *   GET /.well-known/oauth-authorization-server
 *   GET /.well-known/openid-configuration
 *   GET /.well-known/oauth-protected-resource
 */

import { Router, type Request, type Response } from 'express';
import type { EnvConfig } from '../config/env.js';

function resolveBaseUrl(config: EnvConfig, req: Request): string {
    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (host) {
        return `${proto}://${host}`.replace(/\/+$/, '');
    }
    return config.MCP_SERVER_URL.replace(/\/+$/, '');
}

export function createMetadataRouter(config: EnvConfig): Router {
    const router = Router();

    const metadataHandler = (req: Request, res: Response) => {
        const base = resolveBaseUrl(config, req);

        res.json({
            issuer: base,
            authorization_endpoint: `${base}/oauth/authorize`,
            token_endpoint: `${base}/oauth/token`,
            registration_endpoint: `${base}/oauth/register`,
            revocation_endpoint: `${base}/oauth/revoke`,
            response_types_supported: ['code'],
            grant_types_supported: ['authorization_code', 'refresh_token'],
            code_challenge_methods_supported: ['S256'],
            token_endpoint_auth_methods_supported: ['none'],
            scopes_supported: ['mcp:full'],
            service_documentation: 'https://embrapa.io',
        });
    };

    router.get('/.well-known/oauth-authorization-server', metadataHandler);
    router.get('/.well-known/openid-configuration', metadataHandler);

    // RFC 9470 — Protected Resource Metadata
    router.get(
        '/.well-known/oauth-protected-resource',
        (req: Request, res: Response) => {
            const base = resolveBaseUrl(config, req);

            res.json({
                resource: base,
                authorization_servers: [base],
                bearer_methods_supported: ['header'],
                scopes_supported: ['mcp:full'],
            });
        }
    );

    return router;
}
