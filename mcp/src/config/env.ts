/**
 * Validação e tipagem de variáveis de ambiente com Zod.
 *
 * Adaptado para o MCP Loki Server — variáveis específicas
 * para consulta de logs do Grafana Loki.
 */

import { z } from 'zod';

const envSchema = z.object({
    /** Ambiente de execução */
    NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

    /** URL base da API do backend Embrapa I/O */
    BACKEND_API_URL: z.string().url(),

    /** URL pública do MCP Server */
    MCP_SERVER_URL: z.string().url(),

    /** Origens CORS permitidas (CSV) — se vazio, usa MCP_SERVER_URL */
    MCP_CORS_ORIGINS: z.string().default(''),

    /** Secret para assinatura de sessões OAuth (mín. 32 caracteres) */
    SESSION_SECRET: z.string().min(32),

    /** TTL do access token em segundos (default: 7 dias) */
    ACCESS_TOKEN_TTL: z.coerce.number().int().positive().default(604800),

    /** TTL do refresh token em segundos (default: 30 dias) */
    REFRESH_TOKEN_TTL: z.coerce.number().int().positive().default(2592000),

    /** Nível de log */
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

    /** URL interna do Loki (rede Docker) */
    LOKI_URL: z.string().url().default('http://loki:3100'),

    /** Nome do label de compose_project no Loki */
    LOKI_LABEL_NAME: z.string().default('compose_project'),

    /** URL do Valkey/Redis */
    VALKEY_URL: z.string().default('redis://valkey:6379'),

    /** Intervalo de cleanup de tokens expirados em ms (default: 1h) */
    CLEANUP_INTERVAL_MS: z.coerce.number().int().positive().default(3600000),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Valida as variáveis de ambiente e retorna o objeto de configuração tipado.
 * Lança erro explícito indicando quais variáveis estão ausentes ou inválidas.
 */
export function loadConfig(): EnvConfig {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        const erros = result.error.issues
            .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
            .join('\n');

        throw new Error(
            `Falha na validação das variáveis de ambiente:\n${erros}`
        );
    }

    return result.data;
}
