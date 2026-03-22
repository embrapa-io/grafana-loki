/**
 * Resolução de escopo de projetos com cache.
 *
 * Determina quais projetos um usuário autenticado pode acessar
 * e resolve builds (app + stage) disponíveis no Loki.
 */

import { decodeJwt } from 'jose';
import { Redis } from 'ioredis';
import type { Logger } from 'pino';
import * as z from 'zod/v4';
import { LokiClient } from '../loki/client.js';

/** Erro de escopo para acesso negado */
export class ScopeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScopeError';
    }
}

const SCOPE_CACHE_PREFIX = 'scope:';
const BUILDS_CACHE_PREFIX = 'builds:';
const BUILDS_CACHE_TTL = 900; // 15min

// Schema para validação da resposta da API de projetos
const projectsResponseSchema = z.array(
    z.object({
        slug: z.string(),
    }).passthrough()
);

export interface ScopeResolverOptions {
    redis: Redis;
    backendApiUrl: string;
    lokiLabelName: string;
    logger: Logger;
}

export interface BuildInfo {
    app: string;
    stages: string[];
}

export class ScopeResolver {
    private redis: Redis;
    private backendApiUrl: string;
    private lokiLabelName: string;
    private logger: Logger;

    constructor({ redis, backendApiUrl, lokiLabelName, logger }: ScopeResolverOptions) {
        this.redis = redis;
        this.backendApiUrl = backendApiUrl.replace(/\/+$/, '');
        this.lokiLabelName = lokiLabelName;
        this.logger = logger;
    }

    /**
     * Resolve projetos do usuário autenticado.
     * Verifica cache Valkey antes de chamar a API do backend.
     */
    async resolveProjects(backendJwt: string): Promise<string[]> {
        // Decodifica JWT (sem verificação — já validado pelo backend)
        const payload = decodeJwt(backendJwt);
        const userId = (payload.sub ?? payload.email ?? 'unknown') as string;
        const exp = payload.exp;

        // Verifica expiração
        if (exp && exp < Math.floor(Date.now() / 1000)) {
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        // Verifica cache
        const cacheKey = `${SCOPE_CACHE_PREFIX}${userId}`;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached) as unknown;
                if (Array.isArray(parsed)) {
                    this.logger.debug({ userId, source: 'cache' }, 'Escopo resolvido via cache');
                    return parsed as string[];
                }
            } catch {
                this.logger.warn({ userId }, 'Cache de escopo corrompido — ignorando');
                await this.redis.del(cacheKey);
            }
        }

        // Chama API do backend
        const res = await fetch(`${this.backendApiUrl}/projects`, {
            headers: { Authorization: `Bearer ${backendJwt}` },
        });

        if (!res.ok) {
            throw new Error(`Falha ao resolver projetos (HTTP ${res.status})`);
        }

        const body = await res.json();
        const parsed = projectsResponseSchema.safeParse(body);

        if (!parsed.success) {
            this.logger.error({ issues: parsed.error.issues }, 'Resposta inválida da API de projetos');
            throw new Error('Resposta inválida da API de projetos');
        }

        const slugs = parsed.data.map(p => p.slug);

        // Cacheia com TTL = min(300s, secondsUntilJwtExpiry)
        const ttl = exp
            ? Math.min(300, exp - Math.floor(Date.now() / 1000))
            : 300;

        if (ttl > 0) {
            await this.redis.set(cacheKey, JSON.stringify(slugs), 'EX', ttl);
        }

        this.logger.info({ userId, projects: slugs.length, ttl }, 'Escopo resolvido via API');

        return slugs;
    }

    /**
     * Verifica se o usuário tem acesso ao projeto.
     * Lança erro se não autorizado.
     */
    assertProjectAccess(project: string, allowedProjects: string[]): void {
        if (!allowedProjects.includes(project)) {
            throw new ScopeError(
                `Acesso negado ao projeto "${project}". Projetos disponíveis: ${allowedProjects.join(', ')}`
            );
        }
    }

    /**
     * Resolve builds (app + stage) disponíveis no Loki para um projeto.
     * Consulta label values do Loki filtrando por prefixo do projeto.
     */
    async resolveLokiBuilds(lokiClient: LokiClient, project: string): Promise<BuildInfo[]> {
        // Verifica cache de builds
        const cacheKey = `${BUILDS_CACHE_PREFIX}${project}`;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached) as unknown;
                if (Array.isArray(parsed)) {
                    return parsed as BuildInfo[];
                }
            } catch {
                this.logger.warn({ project }, 'Cache de builds corrompido — ignorando');
                await this.redis.del(cacheKey);
            }
        }

        // Consulta Loki por label values com match de prefixo
        const match = `{${this.lokiLabelName}=~"${project}_.*"}`;
        const values = await lokiClient.labelValues(this.lokiLabelName, match);

        // Parse: compose_project = ${project}_${app}_${stage}
        const prefix = `${project}_`;
        const buildsMap = new Map<string, Set<string>>();

        for (const value of values) {
            if (!value.startsWith(prefix)) continue;

            const rest = value.slice(prefix.length);
            const lastUnderscore = rest.lastIndexOf('_');
            if (lastUnderscore === -1) continue;

            const app = rest.slice(0, lastUnderscore);
            const stage = rest.slice(lastUnderscore + 1);

            if (!['alpha', 'beta', 'release'].includes(stage)) continue;

            if (!buildsMap.has(app)) {
                buildsMap.set(app, new Set());
            }
            buildsMap.get(app)!.add(stage);
        }

        const builds: BuildInfo[] = [];
        for (const [app, stages] of buildsMap) {
            builds.push({ app, stages: [...stages].sort() });
        }

        // Cacheia builds por 15min
        if (builds.length > 0) {
            await this.redis.set(cacheKey, JSON.stringify(builds), 'EX', BUILDS_CACHE_TTL);
        }

        this.logger.debug({ project, builds: builds.length }, 'Builds resolvidos via Loki');

        return builds;
    }
}
