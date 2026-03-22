/**
 * Tipos TypeScript para a API do Loki.
 */

export interface LokiQueryParams {
    query: string;
    start?: string;
    end?: string;
    limit?: number;
    direction?: 'forward' | 'backward';
}

export interface LokiStream {
    stream: Record<string, string>;
    values: [string, string][]; // [timestamp_ns, line]
}

export interface LokiMatrixResult {
    metric: Record<string, string>;
    values: [number, string][]; // [unix_timestamp, value_string]
}

export interface LokiQueryResponse {
    status: string;
    data: {
        resultType: 'streams' | 'matrix' | 'vector';
        result: LokiStream[] | LokiMatrixResult[];
    };
}

export interface LokiLabelResponse {
    status: string;
    data: string[];
}

export interface FormattedLogEntry {
    timestamp: string;
    line: string;
    labels: Record<string, string>;
}
