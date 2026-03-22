/**
 * Builder de queries LogQL tipado.
 *
 * Constrói queries seguras para a API do Loki usando seletores
 * baseados no label compose_project com regex.
 */

import { sanitizeLogQLInput } from './sanitize.js';

export interface LogQLParams {
    project: string;
    app?: string;
    stage?: string;
    search?: string;
    level?: string;
    labelName?: string;
}

export interface StatsLogQLParams {
    project: string;
    app?: string;
    since: string;
    labelName?: string;
}

/**
 * Converte string de duração relativa (ex: "1h", "24h", "7d") para milissegundos.
 */
export function parseSince(since: string): number {
    const match = since.match(/^(\d+)([mhd])$/);
    if (!match) return 60 * 60 * 1000; // default 1h

    const value = parseInt(match[1]!, 10);
    const unit = match[2]!;

    switch (unit) {
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return 60 * 60 * 1000;
    }
}

/**
 * Converte duração relativa para formato ISO start time.
 */
export function sinceToStartTime(since: string): string {
    const ms = parseSince(since);
    return new Date(Date.now() - ms).toISOString();
}

/**
 * Calcula o intervalo de range vector a partir de duração em ms.
 * interval = max(1m, since_duration_minutes / 60)
 */
export function calculateRangeInterval(since: string): string {
    const ms = parseSince(since);
    const minutes = ms / (60 * 1000);
    const interval = Math.max(1, Math.round(minutes / 60));
    return `${interval}m`;
}

/**
 * Constrói o seletor LogQL baseado em project/app/stage.
 */
function buildSelector(project: string, app?: string, stage?: string, labelName = 'compose_project'): string {
    if (app && stage) {
        return `{${labelName}="${project}_${app}_${stage}"}`;
    }
    if (app) {
        return `{${labelName}=~"${project}_${app}_(alpha|beta|release)"}`;
    }
    if (stage) {
        return `{${labelName}=~"${project}_[a-zA-Z0-9-]+_${stage}"}`;
    }
    return `{${labelName}=~"${project}_[a-zA-Z0-9-]+_(alpha|beta|release)"}`;
}

/**
 * Constrói query LogQL para busca de logs.
 */
export function buildLogQL(params: LogQLParams): string {
    const { project, app, stage, search, level, labelName } = params;
    let query = buildSelector(project, app, stage, labelName);

    if (level) {
        query += ` |= "${sanitizeLogQLInput(level)}"`;
    }

    if (search) {
        query += ` |= "${sanitizeLogQLInput(search)}"`;
    }

    return query;
}

/**
 * Constrói query LogQL para busca de erros.
 * Usa regex para padrões comuns de erro + pattern customizado.
 */
export function buildErrorLogQL(params: LogQLParams): string {
    const { project, app, stage, search, labelName } = params;
    let query = buildSelector(project, app, stage, labelName);

    query += ` |~ "(?i)(error|exception|fatal|panic|traceback|ECONNREFUSED|ETIMEDOUT)"`;

    if (search) {
        query += ` |= "${sanitizeLogQLInput(search)}"`;
    }

    return query;
}

/**
 * Constrói query LogQL para estatísticas (count_over_time).
 */
export function buildStatsLogQL(params: StatsLogQLParams): string {
    const { project, app, since, labelName } = params;
    const selector = buildSelector(project, app, undefined, labelName);
    const interval = calculateRangeInterval(since);

    return `count_over_time(${selector}[${interval}])`;
}

/**
 * Constrói query LogQL para taxa de erros (count_over_time com filtro de erro).
 */
export function buildErrorRateLogQL(params: StatsLogQLParams): string {
    const { project, app, since, labelName } = params;
    const selector = buildSelector(project, app, undefined, labelName);
    const interval = calculateRangeInterval(since);

    return `count_over_time(${selector} |~ "(?i)(error|exception|fatal|panic)" [${interval}])`;
}
