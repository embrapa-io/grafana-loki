/**
 * Client HTTP para a API do Loki.
 *
 * Usa fetch nativo do Node 22. Stateless — sem conexão persistente.
 * Retry automático: 1 retry com 2s de delay para 5xx e timeout.
 */

import type { Logger } from 'pino';
import type {
    LokiQueryParams,
    LokiQueryResponse,
    LokiLabelResponse,
    LokiStream,
    FormattedLogEntry,
} from './types.js';

const REQUEST_TIMEOUT_MS = 30_000;
const RETRY_DELAY_MS = 2_000;

export class LokiClient {
    private baseUrl: string;
    private logger: Logger;

    constructor(baseUrl: string, logger: Logger) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.logger = logger;
    }

    private async fetchWithRetry(url: string, label: string): Promise<Response> {
        const attempt = async (): Promise<Response> => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

            try {
                const start = Date.now();
                const res = await fetch(url, { signal: controller.signal });
                const durationMs = Date.now() - start;

                this.logger.debug({ url, status: res.status, durationMs }, `Loki ${label}`);

                return res;
            } finally {
                clearTimeout(timeout);
            }
        };

        try {
            const res = await attempt();
            if (res.status >= 500) {
                this.logger.warn({ url, status: res.status }, `Loki ${label} — 5xx, retrying`);
                await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
                return attempt();
            }
            return res;
        } catch (err: unknown) {
            const errName = err instanceof Error ? err.name : 'UnknownError';
            if (errName === 'AbortError' || errName === 'TypeError') {
                this.logger.warn({ url, error: errName }, `Loki ${label} — timeout/network, retrying`);
                await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
                return attempt();
            }
            throw err;
        }
    }

    async queryRange(params: LokiQueryParams): Promise<LokiQueryResponse> {
        const url = new URL(`${this.baseUrl}/loki/api/v1/query_range`);
        url.searchParams.set('query', params.query);
        if (params.start) url.searchParams.set('start', params.start);
        if (params.end) url.searchParams.set('end', params.end);
        if (params.limit) url.searchParams.set('limit', params.limit.toString());
        if (params.direction) url.searchParams.set('direction', params.direction);

        const res = await this.fetchWithRetry(url.toString(), 'query_range');

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`Loki query_range falhou (${res.status}): ${body}`);
        }

        return res.json() as Promise<LokiQueryResponse>;
    }

    async query(params: LokiQueryParams): Promise<LokiQueryResponse> {
        const url = new URL(`${this.baseUrl}/loki/api/v1/query`);
        url.searchParams.set('query', params.query);
        if (params.limit) url.searchParams.set('limit', params.limit.toString());

        const res = await this.fetchWithRetry(url.toString(), 'query');

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`Loki query falhou (${res.status}): ${body}`);
        }

        return res.json() as Promise<LokiQueryResponse>;
    }

    async labelValues(label: string, match?: string): Promise<string[]> {
        const url = new URL(`${this.baseUrl}/loki/api/v1/label/${encodeURIComponent(label)}/values`);
        if (match) url.searchParams.set('match[]', match);

        const res = await this.fetchWithRetry(url.toString(), 'label_values');

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`Loki label_values falhou (${res.status}): ${body}`);
        }

        const data = (await res.json()) as LokiLabelResponse;
        return data.data;
    }

    async labels(): Promise<string[]> {
        const url = `${this.baseUrl}/loki/api/v1/labels`;
        const res = await this.fetchWithRetry(url, 'labels');

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`Loki labels falhou (${res.status}): ${body}`);
        }

        const data = (await res.json()) as LokiLabelResponse;
        return data.data;
    }
}

/**
 * Trunca uma linha de log para o comprimento máximo.
 */
export function truncateLine(line: string, maxPerLine: number): string {
    if (line.length <= maxPerLine) return line;
    return line.slice(0, maxPerLine) + '...';
}

/**
 * Formata a resposta do Loki em entries legíveis com timestamp e labels.
 */
export function formatLogEntries(
    response: LokiQueryResponse,
    maxPerLine = 100
): FormattedLogEntry[] {
    if (response.data.resultType !== 'streams') return [];

    const streams = response.data.result as LokiStream[];
    const entries: FormattedLogEntry[] = [];

    for (const stream of streams) {
        for (const [timestampNs, line] of stream.values) {
            const timestampMs = Number(BigInt(timestampNs) / 1_000_000n);
            entries.push({
                timestamp: new Date(timestampMs).toISOString(),
                line: truncateLine(line, maxPerLine),
                labels: stream.stream,
            });
        }
    }

    return entries;
}
