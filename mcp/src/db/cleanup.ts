/**
 * Job periódico de remoção de tokens expirados.
 *
 * Executado a cada CLEANUP_INTERVAL_MS (padrão: 1h)
 * e uma vez na inicialização do servidor.
 */

import type Database from 'better-sqlite3';
import type { Logger } from 'pino';
import { cleanupExpired } from './queries.js';

export interface StartCleanupJobOptions {
    db: Database.Database;
    logger: Logger;
    intervalMs: number;
}

/**
 * Inicia o job de cleanup periódico.
 * Retorna a referência do interval para possível cancelamento.
 */
export function startCleanupJob({
    db,
    logger,
    intervalMs,
}: StartCleanupJobOptions): NodeJS.Timeout {
    const runCleanup = () => {
        try {
            const result = cleanupExpired(db);
            const total =
                result.sessions + result.accessTokens + result.refreshTokens;

            if (total > 0) {
                logger.info(
                    {
                        sessions: result.sessions,
                        accessTokens: result.accessTokens,
                        refreshTokens: result.refreshTokens,
                    },
                    `Cleanup: ${total} registros expirados removidos`
                );
            }
        } catch (err) {
            logger.error({ err }, 'Erro no cleanup de tokens expirados');
        }
    };

    // Executa imediatamente na inicialização
    runCleanup();

    // Agenda execução periódica
    return setInterval(runCleanup, intervalMs);
}
