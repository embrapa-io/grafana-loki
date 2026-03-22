---
title: 'MCP Server para Consulta de Logs do Grafana Loki'
slug: 'mcp-server-loki-logs'
created: '2026-03-22'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['node:>=22', 'pnpm:>=10', 'express', 'typescript:>=5', 'better-sqlite3:>=11', 'ioredis:>=5', '@modelcontextprotocol/server (workspace)', '@modelcontextprotocol/node (workspace)', '@modelcontextprotocol/express (workspace)', 'valkey:8-alpine', 'pino:>=9', 'pino-pretty:>=13', 'jose', 'zod:>=3', 'helmet:>=8', 'cors', 'express-rate-limit:>=7', 'tsdown', 'tsx', 'vitest']
files_to_modify: ['docker-compose.yml', '.env.example', 'upgrade.sh', 'mcp/Dockerfile', 'mcp/.dockerignore', 'mcp/.npmrc', 'mcp/package.json', 'mcp/pnpm-workspace.yaml', 'mcp/tsconfig.json', 'mcp/tsdown.config.ts', 'mcp/vitest.config.ts', 'mcp/src/index.ts', 'mcp/src/server.ts', 'mcp/src/config/env.ts', 'mcp/src/oauth/authorize.ts', 'mcp/src/oauth/dcr.ts', 'mcp/src/oauth/login.ts', 'mcp/src/oauth/metadata.ts', 'mcp/src/oauth/pkce.ts', 'mcp/src/oauth/revoke.ts', 'mcp/src/oauth/token.ts', 'mcp/src/oauth/views/login.ts', 'mcp/src/oauth/views/assets/*', 'mcp/src/db/schema.ts', 'mcp/src/db/index.ts', 'mcp/src/db/queries.ts', 'mcp/src/db/cleanup.ts', 'mcp/src/mcp/server.ts', 'mcp/src/mcp/auth.ts', 'mcp/src/mcp/event-store.ts', 'mcp/src/mcp/transport/sse.ts', 'mcp/src/mcp/tools/helpers.ts', 'mcp/src/loki/client.ts', 'mcp/src/loki/query-builder.ts', 'mcp/src/loki/sanitize.ts', 'mcp/src/loki/types.ts', 'mcp/src/scope/resolver.ts', 'mcp/src/mcp/tools/list-projects.ts', 'mcp/src/mcp/tools/list-builds.ts', 'mcp/src/mcp/tools/query-logs.ts', 'mcp/src/mcp/tools/tail-logs.ts', 'mcp/src/mcp/tools/search-errors.ts', 'mcp/src/mcp/tools/log-stats.ts', 'mcp/common/tsconfig/**', 'mcp/packages/core/**', 'mcp/packages/server/**', 'mcp/packages/middleware/node/**', 'mcp/packages/middleware/express/**']
code_patterns: ['express + MCP SDK transport (Streamable HTTP + SSE)', 'OAuth 2.1 + PKCE + DCR com login OTP (copiar de ../mcp)', 'SQLite para persistência OAuth (copiar schema de ../mcp)', 'Valkey para EventStore MCP + cache de escopo + cache de labels', 'LogQL query builder com sanitização (nunca expor raw LogQL)', 'compose_project label filtering com regex ${project}_[a-zA-Z0-9-]+_(alpha|beta|release)', 'max_per_line para truncar linhas de log (padrão 100 chars, lição do tumf/grafana-loki-mcp)', 'direction forward/backward para ordenação temporal', 'Grafana-style relative time (now-1h, now-6h, now-7d)']
test_patterns: ['vitest para unit tests', 'healthcheck /health endpoint', 'docker compose up --wait', 'OAuth flow e2e (DCR → authorize → login → token)', 'LogQL query builder unit tests', 'sanitize input unit tests', 'scope resolver unit tests com mock da API']
---

# Tech-Spec: MCP Server para Consulta de Logs do Grafana Loki

**Created:** 2026-03-22

## Overview

### Problem Statement

Usuários do Embrapa I/O não têm acesso programático (via MCP) aos logs das suas aplicações coletados pelo Grafana Loki. Servidores MCP genéricos da comunidade autenticam com um único service account admin, dando ao consumidor acesso irrestrito a todos os logs de todos os projetos. A API do Loki (`/loki/api/v1/query_range`) não possui conceito de ACL — retorna qualquer stream que corresponda ao seletor LogQL. Portanto, o controle de acesso precisa ser implementado na camada do MCP server, filtrando queries pelo label `compose_project` com base nos projetos do usuário autenticado.

### Solution

Desenvolver um MCP server custom em `mcp/` dentro deste repositório, seguindo a arquitetura padrão do Embrapa I/O estabelecida em `../mcp` (Node + Express + TypeScript + SQLite + Valkey + OAuth 2.1 + PKCE + DCR). O server autentica o usuário via OTP (email → PIN → JWT), resolve o escopo de projetos via `GET /projects` da API Embrapa I/O, e monta queries LogQL internamente com filtros por `compose_project` (`${project}_*`) para garantir que o usuário acesse apenas logs dos projetos dos quais faz parte da equipe. O Loki é consultado diretamente pela rede Docker interna, sem passar pelo Grafana.

### Scope

**In Scope:**
- Subdiretório `mcp/` como parte do monorepo deste repositório
- Scaffolding Node + Express + TypeScript seguindo arquitetura do `../mcp`
- OAuth 2.1 + PKCE + DCR copiado e adaptado do `../mcp` (login OTP, SQLite para persistência)
- Valkey para `ValkeyEventStore` (sessões MCP/SSE) e cache de escopo de projetos (TTL 5min)
- Transports: Streamable HTTP + SSE (legacy), mesma abordagem do `../mcp`
- 6 MCP tools: `list_projects`, `list_builds`, `query_logs`, `tail_logs`, `search_errors`, `log_stats`
- Resolução de escopo via `GET /projects` da API Embrapa I/O (retorna projetos do usuário autenticado)
- Query builder LogQL com sanitização de input — filtro por `compose_project` com regex `${project}_[a-zA-Z0-9-]+_(alpha|beta|release)`
- Client HTTP para API do Loki (`http://loki:3100`) via rede Docker interna
- Extensão do `docker-compose.yml` existente com serviços `mcp` e `valkey`
- Dockerfile para o serviço MCP
- Cache de labels/builds por projeto no Valkey (TTL 15min)
- Auditoria de tool calls via logging estruturado (pino)

**Out of Scope:**
- Alterações funcionais nos serviços existentes (Grafana, Loki, Nginx) — exceção: adição de `networks: [stack]` a todos os serviços para garantir conectividade
- Backup dos dados do MCP (volumes não críticos, dados reproduzíveis)
- Exposição de LogQL raw ao usuário (o MCP monta queries internamente)
- Logs de stage `development` (ambiente local, não sobe para o Loki)
- Dashboard no Grafana para os mesmos dados
- Alterações nos Docker logging plugins das VMs remotas
- Packages compartilhados do MCP SDK (serão copiados/adaptados, não importados do workspace `../mcp`)

## Context for Development

### Codebase Patterns

- **Arquitetura de referência (`../mcp`)**: Express + MCP SDK com `NodeStreamableHTTPServerTransport` e `SSEServerTransport` custom. OAuth 2.1 completo com DCR, PKCE S256, login OTP (email → PIN → JWT via backend Embrapa I/O). SQLite (`better-sqlite3`) para `oauth_clients`, `oauth_sessions`, `access_tokens`, `refresh_tokens`. Valkey (`ioredis`) para `ValkeyEventStore`. Pino para logging. Monorepo pnpm com packages customizados do MCP SDK em `packages/`.
- **Docker Compose atual**: Serviços com `restart: unless-stopped`, volumes externos nomeados via `${VARIABLE}` no `.env`, healthchecks nativos com `wget`.
- **Loki**: Config em `loki-config.yaml`, TSDB store, schema v13. Acessível apenas pela rede Docker interna em `loki:3100`. O label `compose_project` segue o padrão `${project}_${app}_${stage}` onde `project` e `app` aceitam `[a-zA-Z0-9-]` e `stage` é `alpha|beta|release`.
- **Variáveis de ambiente**: `.env` (gitignored), `.env.example` commitado.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `../mcp/src/oauth/*` | Implementação OAuth 2.1 de referência (copiar e adaptar) |
| `../mcp/src/db/*` | Schema SQLite e queries de referência (copiar e adaptar) |
| `../mcp/src/mcp/server.ts` | Setup do MCP Server com transports (copiar e adaptar) |
| `../mcp/src/mcp/event-store.ts` | ValkeyEventStore de referência (copiar e adaptar) |
| `../mcp/src/mcp/auth.ts` | Middleware de auth MCP (copiar e adaptar) |
| `../mcp/src/mcp/transport/sse.ts` | SSEServerTransport custom (copiar e adaptar) |
| `../mcp/src/config/env.ts` | Configuração de variáveis de ambiente (copiar e adaptar) |
| `../mcp/src/backend/proxy.ts` | Proxy para API Embrapa I/O (referência para chamadas ao backend) |
| `../mcp/src/index.ts` | Entry point do server (copiar e adaptar) |
| `../mcp/package.json` | Dependências e scripts de referência |
| `docker-compose.yml` | Compose existente — estender com `mcp` e `valkey` |
| `.env.example` | Template de variáveis — estender com vars do MCP |
| `loki-config.yaml` | Config do Loki (referência para API interna) |

### Technical Decisions

1. **Express (não Hono)**: Seguir o padrão do `../mcp` para consistência na plataforma. Os packages customizados do MCP SDK são baseados em Express.
2. **SQLite + Valkey (não Valkey-only)**: Manter o mesmo padrão de persistência do `../mcp` — SQLite para dados relacionais OAuth, Valkey para event store e cache.
3. **Copiar e adaptar (não shared package)**: O `../mcp` ainda está em v0.1.0. Copiar os arquivos OAuth/DB e adaptar é mais pragmático do que extrair packages compartilhados prematuramente.
4. **Consulta direta ao Loki (não via Grafana)**: Sem overhead de auth do Grafana, sem service account, API mais simples, independência operacional.
5. **Filtragem por `compose_project`**: O padrão `${project}_*` aplicado ao label `compose_project` do Loki é suficiente para garantir isolamento de acesso. Projetos usam slugs únicos com `[a-zA-Z0-9-]`.
6. **Serviço `mcp` (não `mcp-loki`)**: Nome do serviço no compose será `mcp` para simplicidade.
7. **Sem backup**: Dados do MCP (SQLite OAuth + Valkey cache) são não-críticos e reproduzíveis. Não entram no serviço `backup`.
8. **Packages do MCP SDK**: Copiar os 3 packages customizados (`core`, `middleware/node`, `middleware/express`) de `../mcp/packages/` para `mcp/packages/`. Manter estrutura monorepo pnpm com workspaces.
9. **`max_per_line` (lição do tumf/grafana-loki-mcp)**: Todas as tools que retornam linhas de log incluem parâmetro `max_per_line` (default 100) para truncar linhas longas e evitar inundar o context window da LLM. Padrão comprovado na prática como essencial para eficiência.
10. **Grafana-style relative time**: Parâmetros temporais aceitam formato `now-1h`, `now-6h`, `now-7d` além de ISO 8601 e Unix timestamps. Mais intuitivo para interação com LLMs.
11. **`direction` forward/backward**: Queries aceitam direção de ordenação temporal. Default `backward` (mais recente primeiro) para `query_logs` e `tail_logs`.
12. **Sem Sentry**: Diferente do `../mcp`, este server não inclui Sentry inicialmente (simplicidade). Pode ser adicionado depois.
13. **Backend JWT expiration handling (F1)**: O `backendJwt` obtido no login OTP tem sua própria expiração (definida pelo backend Embrapa I/O), independente do `access_token` do MCP (TTL 7d). O `ScopeResolver` deve decodificar o JWT com `jose.decodeJwt()` (sem verificação de assinatura — o JWT já foi validado pelo backend no login) e checar o claim `exp` antes de usar. Se expirado, retornar erro `McpError(ErrorCode.InvalidRequest, "Sessão expirada. Faça login novamente.")` em vez de falhar silenciosamente na API do backend. O cache de escopo (`scope:${userId}`) deve usar como TTL o menor entre 300s e o tempo restante do JWT.
14. **Label `compose_project` configurável (F4)**: O nome do label do Loki é configurável via variável de ambiente `LOKI_LABEL_NAME` (default: `compose_project`). Todas as referências ao nome do label no query builder e scope resolver devem usar esta config, nunca hardcoded.
15. **Intervalo de range vector para metric queries (F7)**: Metric queries do Loki (`count_over_time`, `rate`) exigem intervalo no range vector, ex: `count_over_time({selector}[5m])`. O intervalo é calculado automaticamente: `interval = max(1m, since_duration / 60)`. Para `since: 1h` → `[1m]`, para `since: 24h` → `[24m]`, para `since: 7d` → `[168m]`. A resposta é do tipo `matrix` (não `streams`) e requer parsing diferente no `LokiClient`.
16. **Enforcement de `since` máximo (F3)**: `parseSince()` deve rejeitar valores maiores que 30 dias. Se `since > 30d`, retornar `McpError(ErrorCode.InvalidParams, "Período máximo: 30d")`.
17. **Error handling para Loki indisponível (F8)**: O `LokiClient` deve capturar erros de conexão (`ECONNREFUSED`, timeout, 5xx) e retornar `McpError(ErrorCode.InternalError, "Serviço de logs temporariamente indisponível. Tente novamente em alguns minutos.")` em vez de propagar erros opacos. Retry automático: 1 retry com 2s de delay para 5xx e timeout.
18. **Redis connection management (F2)**: Criar uma instância `Redis` (ioredis) compartilhada no `index.ts` e passá-la tanto para o `ValkeyEventStore` quanto para o `ScopeResolver`. O `ValkeyEventStore` deve aceitar uma instância `Redis` externa em vez de criar internamente. Adaptar o construtor.
19. **CORS origins (F13)**: Configurar CORS com `origin` como array de origens permitidas via variável `MCP_CORS_ORIGINS` (default: `MCP_SERVER_URL`). Permitir também `localhost` em `NODE_ENV=development`.
20. **Docker network `stack` (F9)**: Todos os serviços (existentes e novos) devem declarar `networks: [stack]`. A network `stack` é declarada como `driver: bridge` na seção `networks` do compose.
21. **Audit logging estruturado (F10)**: Cada tool call deve logar via pino com campos estruturados: `{ audit: true, userId, tool, params, logqlGenerated, resultCount, durationMs }`. Implementar como wrapper/middleware aplicado a todas as tools no registro.

## Implementation Plan

### Tasks

#### Fase 1: Scaffolding e Infraestrutura

- [ ] **Task 1**: Copiar packages e common do MCP SDK de `../mcp/` para `mcp/`
  - Files: `mcp/common/tsconfig/**`, `mcp/packages/core/**`, `mcp/packages/server/**`, `mcp/packages/middleware/node/**`, `mcp/packages/middleware/express/**`
  - Action: Copiar integralmente os **4 packages** + **1 common** do workspace `../mcp/`. São eles:
    - `common/tsconfig` → `@modelcontextprotocol/tsconfig` (tsconfig base — devDep de todos os packages)
    - `packages/core` → `@modelcontextprotocol/core` (tipos base, protocolo — deps: `ajv`, `ajv-formats`, `json-schema-typed`)
    - `packages/server` → `@modelcontextprotocol/server` (McpServer, AuthInfo)
    - `packages/middleware/node` → `@modelcontextprotocol/node` (NodeStreamableHTTPServerTransport — **depende de Hono**)
    - `packages/middleware/express` → `@modelcontextprotocol/express` (middleware Express)
    Manter `package.json`, `tsconfig.json`, `tsdown.config.ts` e `src/` de cada um. Não copiar `dist/`, `node_modules/` ou arquivos de test.
  - Notes: O package `@modelcontextprotocol/node` tem peer dependency em `hono` e `@hono/node-server`. O `core` depende de `ajv`, `ajv-formats`, `json-schema-typed`. Todos os packages têm devDep em `@modelcontextprotocol/tsconfig`. Os `package.json` dos packages usam `catalog:` version specifiers (ex: `"zod": "catalog:runtimeShared"`) que serão resolvidos pelo `pnpm-workspace.yaml`.

- [ ] **Task 2**: Criar scaffolding do projeto `mcp/`
  - Files: `mcp/package.json`, `mcp/pnpm-workspace.yaml`, `mcp/tsconfig.json`, `mcp/tsdown.config.ts`, `mcp/vitest.config.ts`, `mcp/.npmrc`, `mcp/.dockerignore`
  - Action: Criar `package.json` baseado no `../mcp/package.json` — manter mesma estrutura de `scripts` (`dev`, `build`, `start`, `typecheck`, `test`, `build:packages`), mesma engine (`node >=22`), mesma `packageManager` (`pnpm`). O script `start` deve ser `node dist/index.mjs` (ESM output do tsdown). Dependências:
    - `dependencies`: `@modelcontextprotocol/server: workspace:^`, `@modelcontextprotocol/node: workspace:^`, `@modelcontextprotocol/express: workspace:^`, `better-sqlite3: ^11`, `cors`, `express`, `express-rate-limit: ^7`, `helmet: ^8`, `hono: ^4`, `@hono/node-server: ^1`, `ioredis: ^5`, `jose`, `pino: ^9`, `pino-pretty: ^13`, `zod: catalog:runtimeShared` (resolve para `^4.0` — usar Zod v4, import via `'zod/v4'`)
    - `devDependencies`: `@types/better-sqlite3`, `@types/cors`, `@types/express`, `@types/node: ^24`, `tsdown`, `tsx`, `typescript: ^5`, `vitest`
    - Criar `pnpm-workspace.yaml` **com seção `catalogs:`** copiada/adaptada de `../mcp/pnpm-workspace.yaml`. Deve incluir:
      - `packages:` com `['common/tsconfig', 'packages/core', 'packages/server', 'packages/middleware/node', 'packages/middleware/express']`
      - `catalogs.devTools:` com versões de `tsdown`, `tsx`, `typescript`, `vitest`, `@types/*`, etc.
      - `catalogs.runtimeServerOnly:` com versões de `hono`, `@hono/node-server`, `express`, `cors`, etc.
      - `catalogs.runtimeShared:` com versões de `zod`, `ajv`, `ajv-formats`, `json-schema-typed`, etc.
      - `catalogs.runtimeClientOnly:` com versão de `jose`, etc.
      - `onlyBuiltDependencies: [better-sqlite3, esbuild]` (esbuild tem binários nativos que tsdown precisa)
    - Criar `tsdown.config.ts` copiado de `../mcp/tsdown.config.ts` — bundler ESM, output `dist/index.mjs`.
    - Criar `vitest.config.ts` copiado de `../mcp/vitest.config.ts` (ou criar básico com `test: { include: ['test/**/*.test.ts'] }`).
    - `tsconfig.json` baseado no `../mcp/tsconfig.json`
    - `.npmrc` com `registry = "https://registry.npmjs.org/"` (mesmo conteúdo do `../mcp/.npmrc`)
    - `.dockerignore`: `node_modules`, `dist`, `.env`, `*.md`, `.git`, `test`
  - Notes: O `name` do package deve ser `@embrapa-io/mcp-loki`. Não incluir Sentry nas dependências. A seção `catalogs:` é **essencial** — sem ela os `catalog:` specifiers nos packages falham. **Após criar todos os arquivos desta task, rodar `cd mcp && pnpm install` para gerar o `pnpm-lock.yaml`** — sem ele o Dockerfile com `--frozen-lockfile` falha. O lock file deve ser commitado.

- [ ] **Task 3**: Criar `mcp/Dockerfile`
  - File: `mcp/Dockerfile`
  - Action: Multi-stage build **seguindo o padrão exato do `../mcp/Dockerfile`** (3 stages com estratégia native-deps-first):
    - **Stage 1 `native-deps`**: `node:22-alpine`. Instalar build tools (`python3`, `make`, `g++`, `sqlite-dev`). Instalar **apenas** deps nativas via `npm install better-sqlite3 pino pino-pretty ioredis` (não pnpm, não todas as deps). Isso produz um `node_modules/` limpo com apenas bindings nativos.
    - **Stage 2 `build`**: `node:22-alpine`. `corepack enable`. Copiar `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `package.json`, `tsdown.config.ts`, `tsconfig.json`, `common/`, `packages/`, `src/`. `pnpm install --frozen-lockfile`. `pnpm build:packages && pnpm build`. O tsdown bundle produz `dist/index.mjs` (ESM).
    - **Stage 3 `runtime`**: `node:22-alpine`. Copiar `node_modules/` **do stage `native-deps`** (não do build — apenas bindings nativos). Copiar `dist/` do stage build. Copiar `src/oauth/views/assets/` para `dist/oauth/views/assets/` (icons e favicon do login). Expor porta 3000. CMD `node dist/index.mjs`.
  - Notes: O stage `native-deps` usa `npm` (não pnpm) para produzir um `node_modules/` mínimo (~30MB vs ~200MB). O tsdown faz bundle de todo o código TS em um único `index.mjs`, portanto o runtime não precisa de source files nem de deps JS — apenas bindings nativos.

- [ ] **Task 4**: Estender `docker-compose.yml` com serviços `mcp` e `valkey`
  - File: `docker-compose.yml`
  - Action: Adicionar 2 serviços ao compose existente (não alterar os 3 serviços atuais: loki, nginx, grafana):
    ```yaml
    mcp:
      build: ./mcp
      ports:
        - "${PORT_MCP:-3001}:3000"
      environment:
        NODE_ENV: production
        LOKI_URL: http://loki:3100
        LOKI_LABEL_NAME: ${LOKI_LABEL_NAME:-compose_project}
        BACKEND_API_URL: ${MCP_BACKEND_API_URL}
        MCP_SERVER_URL: ${MCP_SERVER_URL}
        MCP_CORS_ORIGINS: ${MCP_CORS_ORIGINS:-}
        SESSION_SECRET: ${MCP_SESSION_SECRET}
        ACCESS_TOKEN_TTL: ${MCP_ACCESS_TOKEN_TTL:-604800}
        REFRESH_TOKEN_TTL: ${MCP_REFRESH_TOKEN_TTL:-2592000}
        VALKEY_URL: redis://valkey:6379
        LOG_LEVEL: ${MCP_LOG_LEVEL:-info}
      volumes:
        - ${VOLUME_MCP:-mcp_data}:/data
      depends_on:
        loki:
          condition: service_healthy
        valkey:
          condition: service_healthy
      restart: unless-stopped
      healthcheck:
        test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
        interval: 30s
        timeout: 10s
        retries: 3
        start_period: 15s
      networks:
        - stack

    valkey:
      image: valkey/valkey:8-alpine
      command: >
        valkey-server
          --appendonly yes
          --maxmemory 128mb
          --maxmemory-policy allkeys-lru
      volumes:
        - ${VOLUME_VALKEY:-valkey_data}:/data
      restart: unless-stopped
      healthcheck:
        test: ["CMD", "valkey-cli", "ping"]
        interval: 10s
        timeout: 5s
        retries: 3
      networks:
        - stack
    ```
    Adicionar volumes na seção `volumes` com `external: true` (mesmo padrão dos volumes existentes `loki_data` e `grafana_data`):
    ```yaml
    volumes:
      loki_data:
        external: true
        name: ${VOLUME_LOKI}
      grafana_data:
        external: true
        name: ${VOLUME_GRAFANA}
      mcp_data:
        external: true
        name: ${VOLUME_MCP:-mcp_data}
      valkey_data:
        external: true
        name: ${VOLUME_VALKEY:-valkey_data}
    ```
    Adicionar `networks: stack` (driver: bridge) à seção `networks` do compose.
    Adicionar `networks: [stack]` a **todos** os serviços (loki, nginx, grafana, mcp, valkey).
    Atualizar `upgrade.sh` para ler `VOLUME_MCP` e `VOLUME_VALKEY` do `.env` e criar idempotentemente (`docker volume create ${VOLUME_MCP} 2>/dev/null || true`, `docker volume create ${VOLUME_VALKEY} 2>/dev/null || true`). **Não destruir** estes volumes no upgrade (diferente do `VOLUME_LOKI` que é recriado) — contêm estado OAuth e cache.
  - Notes: O Loki não expõe porta no host — MCP acessa via rede Docker interna (`loki:3100`). O Valkey também não expõe porta. `depends_on` com `condition: service_healthy` garante que o Loki e Valkey estão prontos antes do MCP iniciar. O `PORT_MCP` usa 3001 como default (3000 já é do Grafana). A network `stack` garante que todos os serviços se comunicam.

- [ ] **Task 5**: Estender `.env.example` com variáveis do MCP
  - File: `.env.example`
  - Action: Adicionar ao final do arquivo existente:
    ```env
    # ============================================================
    # MCP Server
    # ============================================================
    PORT_MCP=3001
    VOLUME_MCP=mcp_data
    VOLUME_VALKEY=valkey_data
    MCP_BACKEND_API_URL=https://core.embrapa.io
    MCP_SERVER_URL=https://mcp-loki.embrapa.io
    MCP_SESSION_SECRET=your-session-secret-minimum-32-chars
    MCP_ACCESS_TOKEN_TTL=604800
    MCP_REFRESH_TOKEN_TTL=2592000
    MCP_LOG_LEVEL=info
    LOKI_LABEL_NAME=compose_project
    MCP_CORS_ORIGINS=
    ```
  - Notes: `MCP_SESSION_SECRET` deve ser gerado com `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. `LOKI_LABEL_NAME` é o nome do label Docker injetado no Loki (default `compose_project`). `MCP_CORS_ORIGINS` é lista CSV de origens permitidas (vazio = usa `MCP_SERVER_URL`).

#### Fase 2: Core Infrastructure (copiar e adaptar de ../mcp)

- [ ] **Task 6**: Criar `mcp/src/config/env.ts`
  - File: `mcp/src/config/env.ts`
  - Action: Copiar de `../mcp/src/config/env.ts` e adaptar. Remover variáveis específicas do MCP principal (SENTRY_DSN, MATOMO_ID, IO_STAGE, IO_VERSION, GITLAB_URL, GITLAB_PROJECT_ID). Adicionar: `LOKI_URL` (obrigatório), `LOKI_LABEL_NAME` (default `compose_project`), `MCP_CORS_ORIGINS` (opcional, CSV de origens). Manter: `BACKEND_API_URL`, `MCP_SERVER_URL`, `SESSION_SECRET`, `ACCESS_TOKEN_TTL`, `REFRESH_TOKEN_TTL`, `LOG_LEVEL`, `VALKEY_URL` (default `redis://valkey:6379`), `CLEANUP_INTERVAL_MS` (default `3600000`).
  - Notes: Usar zod para validação, mesmo padrão do `../mcp`. **Atenção**: `VALKEY_URL` e `LOKI_URL` são variáveis novas — no `../mcp` o URL do Valkey é hardcoded como `'redis://valkey:6379'` diretamente no `index.ts`. Aqui extraímos como config para flexibilidade. Similarmente, as variáveis de TTL no `../mcp` usam prefixo `OAUTH_` (ex: `OAUTH_ACCESS_TOKEN_TTL`) — aqui usamos sem prefixo (`ACCESS_TOKEN_TTL`). O dev agent deve criar o schema zod do zero baseado nestas definições, não copiar o do `../mcp` literalmente.

- [ ] **Task 7**: Copiar e adaptar `mcp/src/db/` (SQLite)
  - Files: `mcp/src/db/schema.ts`, `mcp/src/db/index.ts`, `mcp/src/db/queries.ts`, `mcp/src/db/cleanup.ts`
  - Action: Copiar **todos os 4 arquivos** de `../mcp/src/db/`. O `schema.ts` contém o DDL (`CREATE TABLE` statements) que é importado por `index.ts` no `initDatabase()`. O schema é idêntico — manter tabelas `oauth_clients`, `oauth_sessions`, `access_tokens`, `refresh_tokens` sem alterações. Manter todas as queries CRUD. O DB_PATH será `/data/mcp-oauth.db`.
  - Notes: **Não esquecer `schema.ts`** — sem ele `initDatabase()` falha ao importar o DDL.

- [ ] **Task 8**: Copiar e adaptar `mcp/src/mcp/event-store.ts`
  - File: `mcp/src/mcp/event-store.ts`
  - Action: Copiar de `../mcp/src/mcp/event-store.ts` e **adaptar o construtor** para aceitar uma instância `Redis` externa em vez de criá-la internamente. Alterar `ValkeyEventStoreOptions` para `{ redis: Redis, logger: Logger }` (remover `redisUrl`). Remover a criação de `new Redis(redisUrl, ...)` do construtor — a instância vem de fora.
  - Notes: Isso permite que o `index.ts` crie uma única instância `Redis` compartilhada entre `ValkeyEventStore` e `ScopeResolver`. TTL de 86400s para eventos mantido.

#### Fase 3: OAuth Layer (copiar e adaptar de ../mcp)

- [ ] **Task 9**: Copiar e adaptar camada OAuth completa
  - Files: `mcp/src/oauth/pkce.ts`, `mcp/src/oauth/dcr.ts`, `mcp/src/oauth/metadata.ts`, `mcp/src/oauth/authorize.ts`, `mcp/src/oauth/login.ts`, `mcp/src/oauth/token.ts`, `mcp/src/oauth/revoke.ts`, `mcp/src/oauth/views/login.ts`
  - Action: Copiar todos os arquivos de `../mcp/src/oauth/`. Adaptações necessárias:
    - `metadata.ts`: Alterar `service_documentation` e `op_policy_uri` para URLs do MCP Loki.
    - `login.ts`: Remover referências a `config.MATOMO_ID`, `config.IO_STAGE`, `config.IO_VERSION`. O fluxo OTP permanece idêntico (email → `POST /auth/pin` → `POST /auth/verify` → JWT).
    - `views/login.ts`: Remover analytics Matomo. Alterar título/branding para "Embrapa I/O — Logs MCP". Manter o layout e fluxo HTML.
    - `views/assets/*`: Copiar diretório de assets estáticos (favicon.ico, icon-192.png, icon-512.png, logo.svg). Manter ou re-brandar conforme necessário. Estes assets são referenciados pelo HTML do login e devem ser copiados para `dist/oauth/views/assets/` no Dockerfile.
    - `authorize.ts`, `dcr.ts`, `pkce.ts`, `revoke.ts`: Copiar sem alterações significativas (apenas ajustar imports se paths mudarem).
    - `token.ts`: Copiar e **renomear referências** de `config.OAUTH_ACCESS_TOKEN_TTL` → `config.ACCESS_TOKEN_TTL` e `config.OAUTH_REFRESH_TOKEN_TTL` → `config.REFRESH_TOKEN_TTL` para alinhar com o env.ts deste projeto. Verificar todas as ocorrências.
  - Notes: O core do fluxo OAuth é idêntico ao `../mcp`. A diferença é branding, remoção de Matomo/Sentry, e renomeação das variáveis de TTL (no `../mcp` usam prefixo `OAUTH_`, aqui não).

- [ ] **Task 10**: Copiar e adaptar `mcp/src/mcp/auth.ts` (MCP auth middleware)
  - File: `mcp/src/mcp/auth.ts`
  - Action: Copiar de `../mcp/src/mcp/auth.ts`. A interface `McpAuthInfo` permanece: `{ token, email, backendJwt, isEmbrapa }`. O middleware extrai Bearer token → busca no SQLite → resolve JWT do backend. Sem alterações necessárias.
    Copiar também `../mcp/src/mcp/tools/helpers.ts` para `mcp/src/mcp/tools/helpers.ts`. Este arquivo contém `getAuth(ctx)` que extrai `McpAuthInfo` do contexto MCP SDK (`ctx.http?.authInfo` com cast de `unknown` para `McpAuthInfo`) e constantes de resposta padrão (`NOT_AUTHENTICATED`). É usado por **todas** as tools.
  - Notes: O `backendJwt` será usado pelo scope resolver para chamar `GET /projects` na API Embrapa I/O. O `helpers.ts` é dependência implícita de todos os tools — copiar junto com o auth middleware.

- [ ] **Task 11**: Copiar e adaptar `mcp/src/mcp/transport/sse.ts`
  - File: `mcp/src/mcp/transport/sse.ts`
  - Action: Copiar de `../mcp/src/mcp/transport/sse.ts` sem alterações. É o `SSEServerTransport` custom para compatibilidade com clientes legado.
  - Notes: Necessário para clientes MCP que não suportam Streamable HTTP.

#### Fase 4: Loki Integration (novo)

- [ ] **Task 12**: Criar `mcp/src/loki/types.ts`
  - File: `mcp/src/loki/types.ts`
  - Action: Definir tipos TypeScript para a API do Loki:
    ```typescript
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
        result: LokiStream[] | LokiMatrixResult[]; // streams para logs, matrix para métricas
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
    ```

- [ ] **Task 13**: Criar `mcp/src/loki/sanitize.ts`
  - File: `mcp/src/loki/sanitize.ts`
  - Action: Implementar sanitização de input para LogQL:
    ```typescript
    export function sanitizeLogQLInput(input: string): string {
      // Preservar | para buscas OR (ex: "error|warn") — é seguro dentro de |= "..."
      // Remover apenas caracteres que podem escapar do contexto de string LogQL
      return input
        .replace(/[`"\\]/g, '')     // aspas e backticks (escapam de string)
        .replace(/[{}~=!<>]/g, '')  // operadores LogQL (NÃO remover |)
        .slice(0, 200);
    }

    export function validateProjectSlug(slug: string): boolean {
      return /^[a-zA-Z0-9-]+$/.test(slug) && slug.length <= 64;
    }

    export function validateStage(stage: string): stage is 'alpha' | 'beta' | 'release' {
      return ['alpha', 'beta', 'release'].includes(stage);
    }
    ```
  - Notes: Nunca concatenar input do usuário diretamente em LogQL.

- [ ] **Task 14**: Criar `mcp/src/loki/query-builder.ts`
  - File: `mcp/src/loki/query-builder.ts`
  - Action: Implementar o builder de queries LogQL tipado:
    - Função `buildLogQL(params)` que recebe `{ project, app?, stage?, search?, level? }` e retorna string LogQL.
    - O `project` é sempre validado contra `allowedProjects` antes de chegar aqui.
    - Lógica de seletores:
      - `project + app + stage` → match exato `{compose_project="${project}_${app}_${stage}"}`
      - `project + app` → regex `{compose_project=~"${project}_${app}_(alpha|beta|release)"}`
      - `project + stage` → regex `{compose_project=~"${project}_[a-zA-Z0-9-]+_${stage}"}`
      - `project` only → regex `{compose_project=~"${project}_[a-zA-Z0-9-]+_(alpha|beta|release)"}`
    - Pipeline de filtros: `level` → `|= "LEVEL"`, `search` → `|= "sanitized_search"`
    - Função `buildErrorLogQL(params)` para `search_errors` — usa `|~ "(?i)(error|exception|fatal|panic|traceback|ECONNREFUSED|ETIMEDOUT)"` + pattern opcional.
    - Função `buildStatsLogQL(params)` para `log_stats` — usa `count_over_time` e `rate`. O intervalo do range vector é calculado automaticamente: `interval = max(1m, since_duration_minutes / 60)` arredondado para inteiro. Ex: `since: 1h` → `[1m]`, `since: 24h` → `[24m]`. A resposta do Loki para metric queries é do tipo `matrix` (não `streams`) — o `LokiClient` deve parsear ambos os tipos.
    - Função `parseSince(since)` para converter `now-1h`, `30m`, `24h`, `7d` em `{ start, end }` ISO strings. Aceitar Grafana-style (`now-1h`) e formato simples (`1h`, `30m`). **Enforcement de máximo**: rejeitar valores > 30 dias com `McpError(ErrorCode.InvalidParams, "Período máximo: 30d")`.
  - Notes: Toda construção de LogQL passa por sanitização. O builder é o único ponto de construção de queries.

- [ ] **Task 15**: Criar `mcp/src/loki/client.ts`
  - File: `mcp/src/loki/client.ts`
  - Action: Implementar client HTTP para a API do Loki:
    - Classe `LokiClient` com construtor recebendo `baseUrl` (ex: `http://loki:3100`) e `logger`.
    - Método `queryRange(params: LokiQueryParams): Promise<LokiQueryResponse>` — `GET /loki/api/v1/query_range`.
    - Método `query(params: LokiQueryParams): Promise<LokiQueryResponse>` — `GET /loki/api/v1/query` (para métricas instantâneas).
    - Método `labelValues(label: string, match?: string): Promise<string[]>` — `GET /loki/api/v1/label/{label}/values`.
    - Método `labels(): Promise<string[]>` — `GET /loki/api/v1/labels`.
    - Usar `fetch` nativo do Node 22 (sem dependência externa).
    - Timeout de 30s por request. Logging de duração e status com pino. **Error handling**: capturar `ECONNREFUSED`, `ETIMEDOUT`, e respostas 5xx — retornar `McpError(ErrorCode.InternalError, "Serviço de logs temporariamente indisponível.")`. Retry automático: 1 retry com 2s de delay para 5xx e timeout (não retry para 4xx).
    - Função helper `truncateLine(line: string, maxPerLine: number): string` para truncar linhas de log.
    - Função helper `formatLogEntries(response: LokiQueryResponse, maxPerLine: number): FormattedLogEntry[]` para formatar resposta em entries com timestamp legível e linha truncada.
  - Notes: O client é stateless — não precisa de conexão persistente.

#### Fase 5: Scope Resolution (novo)

- [ ] **Task 16**: Criar `mcp/src/scope/resolver.ts`
  - File: `mcp/src/scope/resolver.ts`
  - Action: Implementar resolução de escopo com cache:
    - Classe `ScopeResolver` com construtor recebendo `{ redis, backendApiUrl, logger }`.
    - Método `resolveProjects(backendJwt: string): Promise<string[]>` — retorna slugs dos projetos do usuário:
      1. Decodificar o JWT com `jose.decodeJwt()` (sem verificação de assinatura — o JWT já foi validado pelo backend no login e o access token MCP já foi verificado pelo auth middleware).
      2. Extrair `userId` do claim `sub` ou `email`. Extrair `exp` para checar expiração.
      3. Se JWT expirado (`exp < now`), throw `McpError(ErrorCode.InvalidRequest, "Sessão expirada. Faça login novamente.")`.
      4. Verificar cache Valkey: `scope:${userId}`.
      5. Se cache miss, chamar `GET ${backendApiUrl}/projects` com header `Authorization: Bearer ${backendJwt}`. Validar resposta com zod schema.
      6. Extrair array de `slug` da resposta.
      7. Cachear no Valkey com TTL = `min(300, secondsUntilJwtExpiry)` — garante que o cache nunca ultrapassa a validade do JWT.
      8. Retornar slugs.
    - Método `assertProjectAccess(project: string, allowedProjects: string[]): void` — throw `McpError` se projeto não permitido.
    - Método `resolveLokiBuilds(lokiClient: LokiClient, project: string): Promise<{app: string, stages: string[]}[]>` — consultar label values do Loki filtrando por prefixo do projeto, com cache Valkey TTL 900s (15 min). Parsear `compose_project` values para extrair combinações app + stage.
  - Notes: O `backendJwt` é obtido do `McpAuthInfo` populado pelo auth middleware. A API `GET /projects` retorna todos os projetos do usuário autenticado.

#### Fase 6: MCP Tools (novo)

**Nota para todas as tasks desta fase**:
- **Registro**: Usar `server.registerTool(name, { title, description, inputSchema: z.object({...}) }, handler)` — **não** `server.tool()`. O segundo argumento é um options object com `title`, `description` e `inputSchema` (Zod schema).
- **Zod**: Import como `import * as z from 'zod/v4'` (Zod v4 namespace import, **não** `{ z } from 'zod'`). Cada campo deve ter `.describe()` para guiar o LLM.
- **Auth context**: Usar `getAuth(ctx)` de `../helpers.ts` para extrair `McpAuthInfo` do contexto MCP (auth info vive em `ctx.http?.authInfo` e precisa de cast).
- **Dependency injection**: Cada arquivo de tool exporta uma função `registerXTools(server, { config, lokiClient, scopeResolver, logger })` que fecha sobre as dependências via closure. Seguir o padrão de `../mcp/src/mcp/tools/*.ts`.

- [ ] **Task 17**: Criar `mcp/src/mcp/tools/list-projects.ts`
  - File: `mcp/src/mcp/tools/list-projects.ts`
  - Action: Implementar tool `list_projects`:
    - Sem parâmetros de input.
    - Resolve escopo do usuário via `ScopeResolver.resolveProjects()`.
    - Para cada projeto, resolve builds via `ScopeResolver.resolveLokiBuilds()`.
    - Retorna JSON com `{ projects: [{ slug, apps: [{ name, stages }] }] }`.
    - Description: `"Lista os projetos do Embrapa I/O aos quais você tem acesso, incluindo as aplicações e stages de deploy com logs disponíveis no Loki."`
  - Notes: Esta é a tool de "discovery" — o LLM deve chamá-la primeiro para saber o que está disponível.

- [ ] **Task 18**: Criar `mcp/src/mcp/tools/list-builds.ts`
  - File: `mcp/src/mcp/tools/list-builds.ts`
  - Action: Implementar tool `list_builds`:
    - Input: `{ project: string }` (obrigatório).
    - Valida acesso ao projeto.
    - Resolve builds via Loki label values.
    - Retorna `{ project, builds: [{ app, stages }] }`.
    - Description: `"Lista as aplicações e stages de deploy de um projeto específico que possuem logs no Loki."`

- [ ] **Task 19**: Criar `mcp/src/mcp/tools/query-logs.ts`
  - File: `mcp/src/mcp/tools/query-logs.ts`
  - Action: Implementar tool `query_logs`:
    - Input: `{ project: string, app: string, stage?: 'alpha'|'beta'|'release', search?: string, level?: 'error'|'warn'|'info'|'debug', since?: string, limit?: number, direction?: 'forward'|'backward', max_per_line?: number }`
    - `project` e `app` obrigatórios. `stage` default: sem filtro (todas). `since` default: `1h`. `limit` default: 100, max: 500. `direction` default: `backward`. `max_per_line` default: 100, 0 = unlimited.
    - Valida acesso ao projeto, monta LogQL via builder, executa `queryRange`, formata e trunca resultados.
    - Retorna `{ query_info: { project, app, stage, since, total_results }, logs: FormattedLogEntry[] }`.
    - Description: `"Consulta logs de uma aplicação com filtros opcionais de texto, nível de log e período. Use 'since' com formato relativo (ex: '1h', '30m', '24h', '7d')."`

- [ ] **Task 20**: Criar `mcp/src/mcp/tools/tail-logs.ts`
  - File: `mcp/src/mcp/tools/tail-logs.ts`
  - Action: Implementar tool `tail_logs`:
    - Input: `{ project: string, app: string, stage?: string, lines?: number, max_per_line?: number }`
    - `lines` default: 50, max: 500. `stage` default: `release`. `max_per_line` default: 100.
    - Atalho para `query_logs` com `since: 1h`, `direction: backward`, `limit: lines`.
    - Description: `"Retorna as N linhas de log mais recentes de uma aplicação (snapshot, não streaming). Útil para verificar rapidamente o estado atual. Default: 50 linhas do stage release."`

- [ ] **Task 21**: Criar `mcp/src/mcp/tools/search-errors.ts`
  - File: `mcp/src/mcp/tools/search-errors.ts`
  - Action: Implementar tool `search_errors`:
    - Input: `{ project: string, app?: string, stage?: string, since?: string, pattern?: string, max_per_line?: number }`
    - `since` default: `24h`. `app` e `stage` opcionais (busca em todas se omitido).
    - Usa `buildErrorLogQL` — regex para padrões comuns de erro + pattern customizado.
    - Se `pattern` fornecido, usa como filtro adicional.
    - Retorna `{ query_info, error_count, logs }`.
    - Description: `"Busca por erros, exceções e stack traces nos logs de um projeto. Útil para diagnóstico rápido de problemas. Use 'pattern' para filtrar erros específicos (ex: 'ECONNREFUSED', '500', 'OutOfMemory')."`

- [ ] **Task 22**: Criar `mcp/src/mcp/tools/log-stats.ts`
  - File: `mcp/src/mcp/tools/log-stats.ts`
  - Action: Implementar tool `log_stats`:
    - Input: `{ project: string, app?: string, since?: string }`
    - `since` default: `24h`.
    - Usa metric queries Loki (`count_over_time`, `rate`) para calcular:
      - Total de linhas de log no período.
      - Distribuição por stage (alpha, beta, release).
      - Taxa de erros (linhas com error/exception / total).
    - Retorna `{ project, period, total_lines, by_stage: { alpha, beta, release }, error_rate, top_apps }`.
    - Description: `"Retorna estatísticas sobre o volume de logs: total de linhas, distribuição por stage, taxa de erros. Útil para visão geral do estado da aplicação."`

#### Fase 7: Server Setup e Entry Point

- [ ] **Task 23**: Criar `mcp/src/mcp/server.ts` (MCP server com registro de tools)
  - File: `mcp/src/mcp/server.ts`
  - Action: Copiar estrutura de `../mcp/src/mcp/server.ts` e adaptar:
    - Manter `setupMcpServer()` com mesma assinatura: `{ app, config, logger, db, eventStore }`.
    - Adicionar `lokiClient: LokiClient` e `scopeResolver: ScopeResolver` aos parâmetros.
    - Registrar as 6 tools em vez das tools do MCP principal.
    - **Audit logging**: Implementar wrapper de tool call que mede duração e loga com pino: `{ audit: true, userId, tool, params, logqlGenerated, resultCount, durationMs }`. Aplicar a todas as tools no registro.
    - Manter dual transport: Streamable HTTP (`POST /mcp`) + SSE legacy (`GET /sse` + `POST /messages`).
    - Manter auth middleware idêntico.
    - Adicionar `GET /health` retornando `{ status: 'ok' }`.
  - Notes: O endpoint MCP principal é `/mcp` (não `/` como no `../mcp`), para permitir que o health check use `/health` sem conflito. Usar `setupMcpServer` com base path `/mcp` — montar os handlers do Streamable HTTP transport em `POST/GET/DELETE /mcp` via sub-router ou prefixando manualmente. O audit log usa o campo `audit: true` para facilitar filtragem no pino.
    **Tabela de rotas completa:**
    | Método | Path | Handler |
    |--------|------|---------|
    | GET | `/health` | Health check `{ status: 'ok' }` |
    | POST/GET/DELETE | `/mcp` | Streamable HTTP transport (MCP SDK) |
    | GET | `/sse` | SSE legacy transport (inicia sessão) |
    | POST | `/messages` | SSE legacy transport (recebe JSON-RPC) |
    | GET | `/.well-known/oauth-authorization-server` | OAuth metadata |
    | POST | `/oauth/register` | DCR (Dynamic Client Registration) |
    | GET | `/oauth/authorize` | OAuth authorize redirect |
    | GET/POST | `/oauth/login` | Login form + OTP flow |
    | POST | `/oauth/token` | Token exchange / refresh |
    | POST | `/oauth/revoke` | Token revocation |

- [ ] **Task 24**: Criar `mcp/src/server.ts` (Express app)
  - File: `mcp/src/server.ts`
  - Action: Copiar de `../mcp/src/server.ts` e adaptar:
    - Manter `createApp()` com helmet, cors, rate-limit, JSON body parser, pino-http.
    - **CORS**: Configurar `origin` com lista de origens de `config.MCP_CORS_ORIGINS` (CSV). Se vazio, usar `config.MCP_SERVER_URL`. Em `NODE_ENV=development`, adicionar `http://localhost:*` automaticamente.
    - Montar rotas OAuth: `/.well-known/oauth-authorization-server`, `/oauth/register`, `/oauth/authorize`, `/oauth/login`, `/oauth/token`, `/oauth/revoke`.
    - Remover rotas do backend proxy (não necessário — o MCP Loki consulta o Loki diretamente).
  - Notes: A estrutura Express é essencialmente a mesma, com menos rotas.

- [ ] **Task 25**: Criar `mcp/src/index.ts` (entry point)
  - File: `mcp/src/index.ts`
  - Action: Copiar de `../mcp/src/index.ts` e adaptar:
    - Remover Sentry.
    - **Criar instância `Redis` compartilhada**: `const redis = new Redis(config.VALKEY_URL, { maxRetriesPerRequest: 3, retryStrategy: (times) => Math.min(times * 100, 3000) })`. Passar para `ValkeyEventStore({ redis, logger })` e `ScopeResolver({ redis, ... })`.
    - Adicionar instanciação do `LokiClient` com `{ baseUrl: config.LOKI_URL, logger, labelName: config.LOKI_LABEL_NAME }`.
    - Adicionar instanciação do `ScopeResolver` com `{ redis, backendApiUrl: config.BACKEND_API_URL, logger }`.
    - Passar `lokiClient` e `scopeResolver` para `setupMcpServer()`.
    - Manter: `loadConfig()`, `initDatabase()`, `createApp()`, `ValkeyEventStore`, `startCleanupJob()`.
    - Porta fixa: 3000 (interna do container).
    - **Graceful shutdown**: Registrar handler `process.on('SIGTERM', async () => { ... })` que fecha o HTTP server, desconecta o Redis (`redis.quit()`), fecha o SQLite (`db.close()`), e faz `process.exit(0)`. Timeout de 10s para forçar exit.
  - Notes: Uma única instância `Redis` é compartilhada entre EventStore e ScopeResolver — eficiente e evita conexões duplicadas.

### Acceptance Criteria

- [ ] **AC 1**: Given o docker-compose.yml atualizado, when `docker compose up -d --wait`, then todos os 5 serviços (loki, nginx, grafana, mcp, valkey) atingem status healthy/running.
- [ ] **AC 2**: Given o MCP server rodando, when `GET /health`, then retorna `{ status: 'ok' }` com HTTP 200.
- [ ] **AC 3**: Given um MCP client, when faz DCR via `POST /oauth/register`, then recebe `client_id` e metadata válidos.
- [ ] **AC 4**: Given um client registrado, when inicia authorize flow (`GET /oauth/authorize` com PKCE S256), then é redirecionado para o form de login.
- [ ] **AC 5**: Given o form de login, when o usuário submete email válido, then recebe PIN OTP por email via backend Embrapa I/O.
- [ ] **AC 6**: Given PIN válido, when o usuário submete o PIN, then o backend retorna JWT e o fluxo redireciona ao client com auth code.
- [ ] **AC 7**: Given auth code válido, when o client troca por token (`POST /oauth/token` com code_verifier), then recebe access_token e refresh_token.
- [ ] **AC 8**: Given access_token válido, when chama tool `list_projects`, then retorna apenas os projetos dos quais o usuário faz parte da equipe (não todos os projetos do Loki).
- [ ] **AC 9**: Given um projeto ao qual o usuário TEM acesso, when chama `list_builds` com esse projeto, then retorna as apps e stages com logs disponíveis.
- [ ] **AC 10**: Given um projeto ao qual o usuário NÃO tem acesso, when chama `query_logs` com esse projeto, then retorna erro `InvalidRequest` com mensagem de permissão negada.
- [ ] **AC 11**: Given um projeto válido com logs, when chama `query_logs` com `project`, `app` e `since: 1h`, then retorna logs formatados com timestamps, limitados por `max_per_line` (default 100 chars).
- [ ] **AC 12**: Given logs existentes, when chama `tail_logs` com `lines: 20`, then retorna exatamente as 20 linhas mais recentes do stage release.
- [ ] **AC 13**: Given logs com erros, when chama `search_errors` com `since: 24h`, then retorna apenas linhas contendo padrões de erro (error, exception, fatal, etc.).
- [ ] **AC 14**: Given logs existentes, when chama `log_stats`, then retorna estatísticas com total_lines, distribuição por stage e error_rate.
- [ ] **AC 15**: Given input malicioso no parâmetro `search` (ex: `"}|= "hack`), when processado pelo query builder, then os caracteres especiais são sanitizados e a query LogQL permanece segura.
- [ ] **AC 16**: Given o Valkey com cache de escopo, when o mesmo usuário chama `list_projects` duas vezes em menos de 5 minutos, then a segunda chamada usa cache (não chama a API do backend).
- [ ] **AC 17**: Given o MCP server, when um client conecta via SSE legacy (`GET /sse`), then recebe sessão SSE funcional e consegue enviar tool calls via `POST /messages`.
- [ ] **AC 18**: Given um access_token expirado e refresh_token válido, when o client faz `POST /oauth/token` com `grant_type=refresh_token`, then recebe um novo access_token e refresh_token válidos.
- [ ] **AC 19**: Given um backendJwt expirado (claim `exp` no passado), when o usuário chama qualquer tool, then retorna erro claro "Sessão expirada. Faça login novamente." (não erro opaco do backend).
- [ ] **AC 20**: Given `since: 60d` (maior que 30d), when o usuário chama `query_logs`, then retorna erro `InvalidParams` com mensagem "Período máximo: 30d".
- [ ] **AC 21**: Given o Loki temporariamente indisponível, when o usuário chama `query_logs`, then retorna erro amigável "Serviço de logs temporariamente indisponível." após 1 retry (não stack trace ou ECONNREFUSED).

## Additional Context

### Dependencies

**Serviços externos:**
- **API Embrapa I/O** (`BACKEND_API_URL`): `POST /auth/pin` (solicitar OTP), `POST /auth/verify` (verificar OTP, retorna JWT), `GET /projects` (lista projetos do usuário autenticado).
- **Loki** (`LOKI_URL`): API HTTP interna em `http://loki:3100`. Endpoints: `/loki/api/v1/query_range`, `/loki/api/v1/query`, `/loki/api/v1/labels`, `/loki/api/v1/label/{name}/values`.
- **Valkey**: `redis://valkey:6379`. Usado para `ValkeyEventStore` (sessões MCP) e cache de escopo/labels.

**Dependências de build:**
- Node.js >= 22, pnpm >= 10.
- `better-sqlite3` requer `python3`, `make`, `g++` para compilação nativa no Docker.

**Pré-requisitos:**
- O Loki deve estar rodando e recebendo logs (deploy via Docker logging driver plugin já configurado nas VMs).
- O label `compose_project` deve existir no Loki com valores no padrão `${project}_${app}_${stage}`.
- A API Embrapa I/O deve ter o endpoint `GET /projects` funcional e retornando projetos do usuário autenticado.
- O Nginx Proxy Manager deve ser configurado para rotear `https://mcp-loki.embrapa.io` para `mcp:3000` com WebSocket support (para SSE).

### Testing Strategy

**Unit Tests (vitest):**
- `test/loki/sanitize.test.ts`: Sanitização de input — caracteres especiais removidos, limite de tamanho.
- `test/loki/query-builder.test.ts`: Construção de LogQL — todos os cenários de seletores (project only, project+app, project+app+stage, etc.), pipeline de filtros, parseSince.
- `test/scope/resolver.test.ts`: Resolução de escopo — mock da API, validação de cache hit/miss, assertProjectAccess.
- `test/oauth/*.test.ts`: Copiar e adaptar testes do `../mcp/test/oauth/` (PKCE, DCR, authorize, token, login, revoke, metadata).
- `test/config/env.test.ts`: Validação de variáveis de ambiente.

**Integration Tests (manual + script):**
1. `docker compose up -d --wait` — todos os serviços healthy.
2. `curl http://localhost:3001/health` — HTTP 200 `{ status: 'ok' }`.
3. Fluxo OAuth completo via browser: DCR → authorize → login OTP → token.
4. Tool calls via MCP client: `list_projects` → `query_logs` → `search_errors`.
5. Verificar isolamento de escopo: usuário A não vê logs do projeto de usuário B.
6. Verificar sanitização: enviar `search` com caracteres especiais e confirmar que não quebra.

### Notes

**Riscos altos:**
- **Packages do MCP SDK**: Copiar packages do `../mcp` pode criar divergência. Se o `../mcp` atualizar os packages, este repo ficará desatualizado. Mitigação: documentar a versão/commit de origem e monitorar.
- **Label `compose_project`**: Se o nome do label mudar (improvável), todas as queries falham. Mitigação: configurar o nome do label como variável de ambiente para flexibilidade futura.
- **API `GET /projects`**: Se a API mudar o formato de resposta, o scope resolver quebra. Mitigação: validar resposta com zod schema.

**Limitações conhecidas:**
- O MCP não implementa streaming de logs em tempo real (WebSocket). `tail_logs` é um snapshot dos logs mais recentes.
- O `log_stats` depende de metric queries do Loki que podem ser lentas em datasets grandes. O `since` default de 24h é um compromisso.
- **Loki retention é 72h** (configurado em `loki-config.yaml`). Queries com `since > 3d` retornarão resultados vazios ou parciais. O `parseSince` permite até 30d para acomodar futuras mudanças de retention, mas todas as tools devem incluir na resposta um campo `retention_note: "Logs disponíveis até 72h (configuração atual do Loki)"` quando `since > 72h`.
- Limite de 500 linhas por query para evitar sobrecarga do context window da LLM.

**Considerações futuras (out of scope):**
- Extrair packages do MCP SDK como packages npm publicados compartilhados entre `../mcp` e `mcp/`.
- Adicionar Sentry para monitoramento de erros em produção.
- Adicionar tool `format_logs` (inspirada no `format_loki_results` do tumf) para reformatar resultados em diferentes formatos.
- Adicionar alertas/notificações baseadas em padrões de log.
- Integrar logs de auditoria do próprio MCP no Loki (com `compose_project` dedicado).

### Adversarial Review Disposition

| ID | Severidade | Disposição |
|----|-----------|------------|
| F1 | Critical | **Corrigido** — JWT expiration check no ScopeResolver, TTL de cache limitado pela validade do JWT (TD 13, Task 16, AC 19) |
| F2 | High | **Corrigido** — Redis compartilhado criado no index.ts, ValkeyEventStore aceita instância externa (TD 18, Task 8, Task 25) |
| F3 | High | **Corrigido** — parseSince rejeita > 30d (TD 16, Task 14, AC 20) |
| F4 | Medium | **Corrigido** — LOKI_LABEL_NAME como env var com default `compose_project` (TD 14, Task 4, Task 5, Task 6) |
| F5 | Medium | **Corrigido** — Description do tail_logs atualizada para "snapshot, não streaming" (Task 20) |
| F6 | Medium | **Corrigido** — AC 18 adicionado para refresh_token flow |
| F7 | High | **Corrigido** — Intervalo de range vector calculado automaticamente, parsing de `matrix` especificado (TD 15, Task 14) |
| F8 | Medium | **Corrigido** — LokiClient com retry 1x para 5xx/timeout, erro amigável (TD 17, Task 15, AC 21) |
| F9 | High | **Corrigido** — Network `stack` declarada, adicionada a todos os serviços (TD 20, Task 4) |
| F10 | Medium | **Corrigido** — Audit logging como wrapper de tool call com campos estruturados (TD 21, Task 23) |
| F11 | Medium | **Corrigido** — jose.decodeJwt() sem verificação de assinatura, justificado (TD 13, Task 16) |
| F12 | Low | **Corrigido** — pnpm-workspace.yaml com paths explícitos em vez de globs (Task 2) |
| F13 | Low | **Corrigido** — MCP_CORS_ORIGINS como env var, fallback para MCP_SERVER_URL (TD 19, Task 5, Task 6, Task 24) |

#### Second-Pass Findings (F14-F24)

| ID | Severidade | Disposição |
|----|-----------|------------|
| F14 | Critical | **Corrigido** — Package `server` adicionado à lista (4 packages total: core, server, middleware/node, middleware/express). pnpm-workspace.yaml atualizado (Task 1, Task 2) |
| F15 | Critical | **Corrigido** — `hono: ^4` e `@hono/node-server: ^1` adicionados como dependências (Task 1 notes, Task 2 deps) |
| F16 | High | **Corrigido** — Task 9 agora especifica renomear `config.OAUTH_ACCESS_TOKEN_TTL` → `config.ACCESS_TOKEN_TTL` e `OAUTH_REFRESH_TOKEN_TTL` → `REFRESH_TOKEN_TTL` no `token.ts` |
| F17 | High | **Corrigido** — Task 6 notes clarificam que `VALKEY_URL` e TTLs são configs novas (não copiadas do ../mcp). Dev agent deve criar schema zod do zero |
| F18 | High | **Corrigido** — Out of Scope atualizado para permitir exceção de `networks: [stack]` nos serviços existentes |
| F19 | Medium | **Corrigido** — Novos volumes usam `external: true` (mesmo padrão). upgrade.sh deve criar volumes novos (Task 4) |
| F20 | Medium | **Corrigido** — `schema.ts` adicionado à lista de arquivos da Task 7 (4 arquivos: schema, index, queries, cleanup) |
| F21 | Medium | **Corrigido** — Limitação de retention 72h documentada em Notes. Tools incluem `retention_note` quando `since > 72h` |
| F22 | Medium | **Corrigido** — Sanitizer preserva `|` (seguro dentro de `\|= "..."`) para permitir buscas OR como `error\|warn` |
| F23 | Low | **Corrigido** — Graceful shutdown com SIGTERM handler no index.ts (Task 25): fecha HTTP, Redis, SQLite |
| F24 | Low | **Corrigido** — Subsumido por F14: `core` package incluído na lista de 4 packages |

#### Third-Pass Findings (F25-F35)

| ID | Severidade | Disposição |
|----|-----------|------------|
| F25 | Critical | **Corrigido** — `common/tsconfig` adicionado à Task 1 e pnpm-workspace.yaml (5 itens total: common/tsconfig + 4 packages) |
| F26 | Critical | **Corrigido** — Seção `catalogs:` (devTools, runtimeServerOnly, runtimeShared, runtimeClientOnly) + `onlyBuiltDependencies` especificados na Task 2 |
| F27 | High | **Corrigido** — Dockerfile reescrito com 3 stages: native-deps (npm), build (pnpm+tsdown), runtime (native-deps node_modules + dist/index.mjs) |
| F28 | High | **Corrigido** — `tsdown.config.ts` adicionado à Task 2. Script `start` e Dockerfile CMD usam `dist/index.mjs` |
| F29 | High | **Corrigido** — `views/assets/*` (favicon, icons, logo) adicionados à Task 9. Dockerfile copia assets para dist |
| F30 | Medium | **Corrigido** — Nota geral na Fase 6 especifica uso de Zod `inputSchema` com `.describe()` e import `z from 'zod'` |
| F31 | Medium | **Corrigido** — Tipo `LokiMatrixResult` adicionado com `values: [number, string][]`. `result` é union discriminada por `resultType` |
| F32 | Medium | **Corrigido** — Tabela de rotas completa adicionada à Task 23. Base path `/mcp` via sub-router documentado |
| F33 | Medium | **Corrigido** — `vitest.config.ts` adicionado à Task 2 |
| F34 | Low | **Corrigido** — upgrade.sh cria volumes MCP/Valkey idempotentemente (sem destruir). Diferenciado do VOLUME_LOKI |
| F35 | Low | **Corrigido** — Subsumido por F26: deps do `core` (ajv, etc.) resolvidas via catalogs |

#### Fourth-Pass Findings (F36-F42)

| ID | Severidade | Disposição |
|----|-----------|------------|
| F36 | High | **Corrigido** — API de registro corrigida para `server.registerTool(name, { title, description, inputSchema }, handler)` na nota da Fase 6 |
| F37 | High | **Corrigido** — Import Zod corrigido para `import * as z from 'zod/v4'`. Dep mudada de `^3` para `catalog:runtimeShared` (~`^4.0`) |
| F38 | High | **Corrigido** — `helpers.ts` com `getAuth(ctx)` adicionado à Task 10. Copiado de `../mcp/src/mcp/tools/helpers.ts` |
| F39 | Medium | **Corrigido** — Padrão de closure `registerXTools(server, { config, lokiClient, scopeResolver, logger })` documentado na nota da Fase 6 |
| F40 | Medium | **Corrigido** — `esbuild` adicionado a `onlyBuiltDependencies` na Task 2 |
| F41 | Medium | **Corrigido** — Task 2 notes especificam rodar `pnpm install` para gerar `pnpm-lock.yaml` antes do Docker build |
| F42 | Low | **Corrigido** — `.npmrc` conteúdo alinhado com `../mcp/.npmrc` (`registry = "https://registry.npmjs.org/"`) |
