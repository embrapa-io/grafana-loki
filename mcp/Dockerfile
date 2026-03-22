# ============================================================
# Embrapa I/O MCP Loki Server — Dockerfile Multi-stage
# ============================================================

# --- Stage 1: Dependências de runtime (cacheável) ---
FROM node:22-alpine AS deps

# Instala dependências nativas que precisam de compilação
# Esta layer é cacheada enquanto as versões não mudarem
RUN apk add --no-cache python3 make g++ sqlite-dev && \
    mkdir /app && cd /app && \
    npm init -y > /dev/null 2>&1 && \
    npm install better-sqlite3@^11.10.0 pino@^9.6.0 pino-pretty@^13.0.0 ioredis@^5.6.1 --omit=dev && \
    apk del python3 make g++ && \
    rm -rf /root/.npm /tmp/*

# --- Stage 2: Build do código ---
FROM node:22-alpine AS builder

RUN apk add --no-cache python3 make g++ && \
    corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /build

# Copia arquivos de configuração do workspace primeiro (cache de layers)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# Copia pacotes do SDK (workspace dependencies)
COPY packages/ ./packages/
COPY common/ ./common/

# Instala todas as dependências (incluindo devDependencies para build)
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Copia código-fonte do servidor e configs de build
COPY src/ ./src/
COPY tsconfig.json tsdown.config.ts ./

# Compila TypeScript (tsdown bundla SDK + código em dist/index.mjs)
RUN pnpm run build:packages && pnpm run build

# --- Stage 3: Produção (leve e rápido) ---
FROM node:22-alpine AS production

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copia dependências de runtime pré-compiladas (cacheadas no stage 1)
COPY --from=deps /app/node_modules ./node_modules

# Copia o bundle compilado e assets estáticos
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/src/oauth/views/assets ./dist/oauth/views/assets

# Cria diretório para dados persistentes (SQLite)
RUN mkdir -p /data && chown appuser:appgroup /data

# Volume para persistência do SQLite
VOLUME ["/data"]

# Porta exposta
EXPOSE 3000

# Executa como usuário não-root
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Inicia o servidor
CMD ["node", "dist/index.mjs"]
