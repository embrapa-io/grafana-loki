---
title: 'Upgrade Grafana Loki 3.4.1 e Grafana 11'
slug: 'upgrade-loki-3-grafana-11'
created: '2026-03-21'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['grafana/loki:3.4.1', 'grafana/grafana:11.5.2', 'nginx:1.27.4-alpine', 'docker-compose']
files_to_modify: ['loki-config.yaml', 'docker-compose.yml', 'Dockerfile', 'run.sh', 'nginx-basic-auth.conf', '.env.example', 'grafana/provisioning/datasources/loki.yaml', 'upgrade.sh']
code_patterns: ['docker-compose external volumes', 'loki yaml with schema_config tsdb/v13', 'nginx basic auth proxy via envsubst', 'healthcheck /ready endpoint', 'grafana datasource provisioning']
test_patterns: ['healthcheck via /ready', 'docker compose up --wait', 'loki -verify-config', 'htpasswd -c -b', 'envsubst validation']
---

# Tech-Spec: Upgrade Grafana Loki 3.4.1 e Grafana 11

**Created:** 2026-03-21

## Overview

### Problem Statement

A stack atual do Grafana Loki usa imagens Docker sem tag fixa (`grafana/loki`, `grafana/grafana`, `nginx:latest`), tornando upgrades imprevisíveis. Embora a config já possua `schema_config` com TSDB/v13, existem problemas críticos: (1) volume mount inconsistente — `loki_data:/data/loki` mas `path_prefix: /loki`, (2) compactor working_directory em `/tmp` (efêmero), (3) `deletion_mode` e `compaction_interval` comentados, (4) referência a `ruler.alertmanager_url` inexistente na stack, (5) Nginx Alpine sem `envsubst` garantido no PATH, (6) sem datasource provisioning no Grafana, (7) `upgrade.sh` sem rollback real.

### Solution

Pinar todas as imagens Docker em versões estáveis e exatas (Loki 3.4.1, Grafana 11.5.2, Nginx 1.27.4-alpine), corrigir o `loki-config.yaml`, adaptar Dockerfile para Alpine com todas as dependências, adicionar Grafana datasource provisioning, e reescrever o `upgrade.sh` com procedimento seguro que faz pull/build ANTES de destruir dados. O volume de dados será recriado (fresh start), justificado pela retenção curta de 72h.

### Scope

**In Scope:**
- Pinar `grafana/loki:3.4.1`, `grafana/grafana:11.5.2`, `nginx:1.27.4-alpine` (tags exatas, não floating)
- Corrigir `loki-config.yaml`: fix paths, habilitar compaction_interval/deletion_mode, remover ruler
- Corrigir `docker-compose.yml`: fix volume mount (`loki_data:/loki`), pinar tags, adicionar volume para datasource provisioning
- Adaptar `Dockerfile` para Alpine com `apache2-utils` + `gettext` (para `envsubst`)
- Corrigir `nginx-basic-auth.conf`: usar path absoluto para `auth_basic_user_file`
- Adicionar Grafana datasource provisioning (`grafana/provisioning/datasources/loki.yaml`)
- Sanitizar `.env.example` (remover valores que parecem credenciais reais)
- Reescrever `upgrade.sh` com procedimento seguro (pull/build primeiro, depois destroy)
- Manter Grafana OAuth GitLab inalterado (validado: `GF_AUTH_GITLAB_*` compatível com Grafana 11.x)

**Out of Scope:**
- Migração de dados do volume antigo (será recriado)
- Alterações no `run.sh` do Nginx além do fix de `envsubst` (ver Task 3b)
- Alterações na configuração do Grafana OAuth (variáveis compatíveis confirmado via docs)
- Adição do MCP server (spec separado)
- Alterações nos Docker logging plugins das VMs remotas
- Patching do host OS (removido intencionalmente do `upgrade.sh` — ver Notes)

## Context for Development

### Codebase Patterns

- **Docker Compose**: Serviços com `restart: unless-stopped`, volumes externos nomeados via `${VARIABLE}` no `.env`, healthchecks nativos com `wget`
- **Loki Config**: YAML em `loki-config.yaml` montado como bind mount em `/etc/loki/local-config.yaml`. Já possui `schema_config` com `store: tsdb`, `schema: v13`, `object_store: filesystem`
- **Nginx**: `Dockerfile` custom baseado em `nginx:latest` → instala `apache2-utils` para `htpasswd`. Config via `envsubst` no `run.sh`. Proxy reverso para `loki:3100` com basic auth
- **Variáveis de Ambiente**: `.env` (gitignored), `.env.example` commitado. Contém: `URL_GRAFANA`, `URL_GITLAB`, `PORT_LOKI`, `PORT_GRAFANA`, `VOLUME_LOKI`, `VOLUME_GRAFANA`, `USERNAME`, `PASSWORD`
- **Acesso split**: Grafana acessa Loki pela rede Docker interna (`loki:3100`, sem auth). VMs externas acessam via Nginx (`${PORT_LOKI}`, com basic auth). Loki não expõe porta no host.

### Files to Reference

| File | Purpose | Ação |
| ---- | ------- | ---- |
| `docker-compose.yml` | Definição dos 3 serviços (loki, nginx, grafana) | Pinar tags, fix volume, add provisioning |
| `loki-config.yaml` | Config do Loki (já tem schema_config tsdb/v13) | Fix compactor, remover ruler |
| `Dockerfile` | Build do Nginx com basic auth (`nginx:latest`) | Pinar `nginx:1.27.4-alpine`, `apk`, add `gettext` |
| `nginx-basic-auth.conf` | Config Nginx com proxy_pass e basic auth | Fix path absoluto `auth_basic_user_file` |
| `upgrade.sh` | Script de upgrade simplista | Reescrever com safe order + rollback |
| `.env.example` | Template de variáveis de ambiente | Sanitizar credenciais |
| `run.sh` | Startup script do Nginx (envsubst + htpasswd) | Fix: `envsubst` com lista explícita de variáveis |
| `grafana/provisioning/datasources/loki.yaml` | **Novo** — Datasource provisioning | Criar |

### Technical Decisions

1. **Volume limpo**: O volume `loki_data` será recriado. Com retenção de 72h, perder dados antigos é aceitável e elimina risco de incompatibilidade.
2. **Fix volume mount**: `loki_data:/data/loki` → `loki_data:/loki` para alinhar com `path_prefix: /loki`. A imagem oficial do Loki (`grafana/loki:3.4.1`) não possui conteúdo pré-existente em `/loki` — o binário fica em `/usr/bin/loki`. Validado: mount seguro.
3. **Habilitar compaction**: Descomentar `deletion_mode: filter-and-delete` e `compaction_interval: 10m` — necessários para retenção efetiva. `delete_request_store: filesystem` validado como configuração corrente na doc oficial do Loki 3.x.
4. **Compactor persistente**: `working_directory` de `/tmp/loki/retention` → `/loki/retention` (dentro do volume).
5. **Remover ruler**: `ruler.alertmanager_url` referencia serviço inexistente na stack.
6. **Nginx Alpine com gettext**: `nginx:1.27.4-alpine` (tag exata, não floating). Requer `apk add apache2-utils gettext` — o pacote `gettext` garante que `envsubst` está disponível como binário standalone no PATH, não apenas como stub do entrypoint.
7. **Manter `common.storage.filesystem`**: Loki 3.x aceita ambos padrões — manter para minimizar diff.
8. **Grafana datasource provisioning**: Adicionar provisioning YAML para garantir que o datasource Loki existe após upgrade, eliminando dependência de config manual via UI.
9. **Safe upgrade order**: `upgrade.sh` faz pull/build ANTES de parar a stack e destruir o volume. Se pull/build falhar, a stack continua rodando intacta.
10. **Grafana OAuth validado**: As variáveis `GF_AUTH_GITLAB_AUTH_URL`, `GF_AUTH_GITLAB_TOKEN_URL`, `GF_AUTH_GITLAB_API_URL` são parâmetros estáveis mantidos do Grafana 9 ao 12 (confirmado via documentação oficial). Sem breaking changes.

### Bugs Corrigidos

| Bug | Impacto | Fix |
| --- | ------- | --- |
| Volume mount `:/data/loki` vs `path_prefix: /loki` | Dados em camada efêmera | `loki_data:/loki` |
| Compactor em `/tmp` | Estado perdido em restart | `/loki/retention` |
| `compaction_interval` comentado | Compaction irregular | Descomentar: `10m` |
| `deletion_mode` comentado | Retenção inefetiva | Descomentar: `filter-and-delete` |
| `ruler.alertmanager_url` sem Alertmanager | Erros de conexão nos logs | Remover seção |
| `envsubst` pode não existir no PATH no Alpine | `run.sh` falha silenciosamente | `apk add gettext` + lista explícita de vars em `run.sh` |
| `auth_basic_user_file` com path relativo | Frágil entre distros Nginx | Path absoluto `/etc/nginx/.htpasswd` |
| Grafana datasource não provisionado | Depende de config manual via UI | Provisioning YAML |
| `upgrade.sh` destrói dados antes de validar pull | Sem rollback se pull falhar | Pull/build primeiro |
| `.env.example` com valores tipo credenciais | Expostos no git history | Valores placeholder óbvios |
| Tags Docker floating (`nginx:1.27-alpine`) | Não garante reprodutibilidade | Tags exatas |

## Implementation Plan

### Tasks

- [ ] **Task 1**: Reescrever `loki-config.yaml` para Loki 3.4.1
  - File: `loki-config.yaml`
  - Action: Substituir conteúdo completo pelo YAML alvo (abaixo)
  - Notes: Manter `schema_config.from: 2020-10-24` (data original). Fix compactor path, habilitar deletion_mode e compaction_interval, remover ruler, desabilitar analytics. Remover `rules_directory` (sem ruler ativo). **RISCO**: se Loki 3.4.1 exigir `rules_directory` como campo obrigatório, startup falhará. **MITIGAÇÃO**: executar `-verify-config` (Testing Strategy item 1) ANTES do deploy. Se falhar, restaurar o campo.
  - **YAML alvo:**
    ```yaml
    auth_enabled: false

    server:
      http_listen_port: 3100

    common:
      instance_addr: 127.0.0.1
      path_prefix: /loki
      storage:
        filesystem:
          chunks_directory: /loki/chunks
      replication_factor: 1
      ring:
        kvstore:
          store: inmemory

    schema_config:
      configs:
        - from: 2020-10-24
          store: tsdb
          object_store: filesystem
          schema: v13
          index:
            prefix: index_
            period: 24h

    limits_config:
      retention_period: 72h
      deletion_mode: filter-and-delete

    compactor:
      working_directory: /loki/retention
      compaction_interval: 10m
      retention_enabled: true
      retention_delete_delay: 30m
      delete_request_store: filesystem

    analytics:
      reporting_enabled: false
    ```

- [ ] **Task 2**: Atualizar `docker-compose.yml`
  - File: `docker-compose.yml`
  - Action: 4 edits pontuais (usar string matching, não line numbers):
    1. `image: grafana/loki` → `image: grafana/loki:3.4.1`
    2. `- loki_data:/data/loki` → `- loki_data:/loki`
    3. `image: grafana/grafana` → `image: grafana/grafana:11.5.2`
    4. Adicionar volume bind mount para Grafana datasource provisioning: `- ./grafana/provisioning/datasources:/etc/grafana/provisioning/datasources` (na seção volumes do serviço grafana, antes de `grafana_data`)
  - Notes: Não alterar healthcheck, depends_on, ports, environment. **IMPORTANTE**: montar apenas o subdiretório `datasources/`, NÃO o diretório pai `provisioning/`. Montar o pai ocultaria todos os outros subdiretórios de provisioning do Grafana (dashboards, alerting, plugins, etc.) que a imagem pode conter por padrão.

- [ ] **Task 3**: Adaptar `Dockerfile` para Nginx Alpine
  - File: `Dockerfile`
  - Action: Substituir conteúdo completo:
    ```dockerfile
    FROM nginx:1.27.4-alpine

    RUN apk add --no-cache apache2-utils gettext

    # Basic auth credentials
    ENV BASIC_USERNAME=username
    ENV BASIC_PASSWORD=password

    # Forward host and forward port as env variables
    ENV FORWARD_HOST=google.com
    ENV FORWARD_PORT=80

    # Nginx config file
    WORKDIR /
    COPY nginx-basic-auth.conf nginx-basic-auth.conf

    # Startup script
    COPY run.sh ./
    RUN chmod 0755 ./run.sh
    CMD [ "./run.sh" ]
    ```
  - Notes: `apache2-utils` provê `htpasswd`. `gettext` provê `envsubst` como binário standalone no PATH (não depender do stub do entrypoint do Nginx). Tag exata `1.27.4-alpine` para reprodutibilidade.

- [ ] **Task 3b**: Corrigir `run.sh` com lista explícita de variáveis no `envsubst`
  - File: `run.sh`
  - Action: Alterar a chamada `envsubst` para usar lista explícita de variáveis:
    ```bash
    #!/bin/sh

    # nginx config variable injection (explicit variable list to avoid clobbering)
    envsubst '${FORWARD_HOST} ${FORWARD_PORT}' < nginx-basic-auth.conf > /etc/nginx/conf.d/default.conf

    # htpasswd for basic authentication
    htpasswd -c -b /etc/nginx/.htpasswd $BASIC_USERNAME $BASIC_PASSWORD

    nginx -g "daemon off;"
    ```
  - Notes: Sem lista explícita, `envsubst` substitui TODOS os `$VAR` no template — incluindo variáveis Nginx como `$host`, `$uri`, etc. Isso funciona atualmente por coincidência (o template não usa variáveis Nginx). Ao mudar de Debian para Alpine, o comportamento do `envsubst` do pacote `gettext` pode divergir. Lista explícita é a prática recomendada e elimina o risco.

- [ ] **Task 4**: Corrigir `nginx-basic-auth.conf` com path absoluto
  - File: `nginx-basic-auth.conf`
  - Action: Alterar `auth_basic_user_file` de path relativo para absoluto:
    ```nginx
    server {
      listen 80 default_server;

      location / {
        auth_basic             "Restricted";
        auth_basic_user_file   /etc/nginx/.htpasswd;

        proxy_pass             http://${FORWARD_HOST}:${FORWARD_PORT};
        proxy_read_timeout     900;
      }
    }
    ```
  - Notes: Única mudança: `.htpasswd` → `/etc/nginx/.htpasswd`. Elimina dependência implícita do prefix directory do Nginx ser `/etc/nginx/`. O `run.sh` já cria o arquivo em `/etc/nginx/.htpasswd` via `htpasswd -c -b /etc/nginx/.htpasswd`. O `proxy_read_timeout 900` (15min) é adequado para queries LogQL longas.

- [ ] **Task 5**: Criar Grafana datasource provisioning
  - File: `grafana/provisioning/datasources/loki.yaml` (novo)
  - Action: Criar diretório `grafana/provisioning/datasources/` e o arquivo:
    ```yaml
    apiVersion: 1

    datasources:
      - name: Loki
        type: loki
        access: proxy
        url: http://loki:3100
        isDefault: true
        editable: true
    ```
  - Notes: Garante que o datasource Loki existe após upgrade sem depender de config manual na UI. `access: proxy` significa que o Grafana faz a query server-side (via rede Docker). `editable: true` permite ajustes na UI.

- [ ] **Task 6**: Sanitizar `.env.example`
  - File: `.env.example`
  - Action: Substituir valores que parecem credenciais por placeholders óbvios:
    ```env
    URL_GRAFANA=http://localhost:3000
    URL_GITLAB=http://localhost:8029
    PORT_LOKI=3100
    PORT_GRAFANA=3000
    VOLUME_LOKI=loki
    VOLUME_GRAFANA=grafana
    USERNAME=your-basic-auth-username
    PASSWORD=your-basic-auth-password
    ```
  - Notes: Os valores originais (strings de 64 chars) pareciam credenciais reais e já estão expostos no git history. Novos valores são claramente placeholders.

- [ ] **Task 7**: Reescrever `upgrade.sh` com procedimento seguro
  - File: `upgrade.sh`
  - Action: Substituir conteúdo completo pelo script abaixo
  - Notes: **Ordem segura**: pull/build ANTES de parar a stack. Se pull/build falhar, a stack continua rodando. Volume só é destruído após imagens estarem disponíveis localmente. Flag `-xe` para trace em debug. `--wait-timeout 120` evita hang indefinido se container entrar em restart loop.
  - **Pré-requisito**: Tasks 1-6 devem estar commitadas no git antes de executar este script. O script assume que todos os arquivos (loki-config.yaml, docker-compose.yml, Dockerfile, provisioning, etc.) já estão atualizados.
  - **Script alvo:**
    ```bash
    #!/bin/sh
    set -xe

    echo "=== Upgrade Grafana Loki Stack ==="

    # Pré-requisitos
    command -v docker >/dev/null 2>&1 || { echo "ERROR: docker not found"; exit 1; }
    docker compose version >/dev/null 2>&1 || { echo "ERROR: docker compose v2.1.1+ not found"; exit 1; }

    # Carregar variáveis de ambiente (apenas VOLUME_LOKI é usado pelo script)
    if [ ! -f .env ]; then
      echo "ERROR: .env file not found"; exit 1
    fi

    VOLUME_LOKI=$(grep '^VOLUME_LOKI=' .env | cut -d= -f2)

    if [ -z "${VOLUME_LOKI}" ]; then
      echo "ERROR: VOLUME_LOKI not defined in .env"; exit 1
    fi

    # Verificar que provisioning existe
    if [ ! -f grafana/provisioning/datasources/loki.yaml ]; then
      echo "ERROR: grafana/provisioning/datasources/loki.yaml not found."
      echo "Certifique-se de que as Tasks 1-6 do tech-spec foram aplicadas antes de executar este script."
      exit 1
    fi

    echo "--- Baixando novas imagens (stack continua rodando)..."
    docker compose pull

    echo "--- Construindo imagens locais (stack continua rodando)..."
    docker compose build --no-cache

    echo "--- Pull/build OK. Parando stack..."
    docker compose down

    echo "--- Recriando volume do Loki (fresh start)..."
    docker volume rm "${VOLUME_LOKI}" 2>/dev/null || true

    # Verificar que o volume foi removido
    if docker volume inspect "${VOLUME_LOKI}" >/dev/null 2>&1; then
      echo "ERROR: Volume ${VOLUME_LOKI} não pôde ser removido (pode estar em uso por outro container)."
      echo "Verifique com: docker ps -a --filter volume=${VOLUME_LOKI}"
      echo "A stack foi parada mas o volume antigo permanece. Resolva manualmente e execute novamente."
      exit 1
    fi

    docker volume create "${VOLUME_LOKI}"

    echo "--- Subindo stack..."
    docker compose up -d --wait --wait-timeout 120

    echo "--- Verificando saúde dos containers..."
    docker compose ps

    echo ""
    echo "=== Upgrade concluído ==="
    echo ""
    echo "Verifique:"
    echo "  - Loki:    curl -u USER:PASS http://localhost:\$(grep PORT_LOKI .env | cut -d= -f2)/ready"
    echo "  - Grafana: http://localhost:\$(grep PORT_GRAFANA .env | cut -d= -f2)"
    echo ""
    echo "Rollback:"
    echo "  git checkout -- docker-compose.yml Dockerfile loki-config.yaml run.sh nginx-basic-auth.conf .env.example"
    echo "  rm -rf grafana/provisioning"
    echo "  docker compose down"
    echo "  docker volume rm ${VOLUME_LOKI} 2>/dev/null; docker volume create ${VOLUME_LOKI}"
    echo "  docker compose pull && docker compose build --no-cache"
    echo "  docker compose up -d --wait --wait-timeout 120"
    ```

### Acceptance Criteria

- [ ] **AC1**: Given a config `loki-config.yaml` com compactor corrigido e schema v13, when `docker compose up -d --wait --wait-timeout 120` é executado, then o container `loki` atinge status `healthy` via `/ready` dentro do healthcheck timeout (start_period 10s + retries 6 × (interval 5s + timeout 2s) = 52s máximo).
- [ ] **AC2**: Given `loki_data:/loki` no docker-compose e `path_prefix: /loki` na config, when o Loki escreve chunks e index, then os dados persistem no volume Docker (verificável via `docker exec loki ls /loki/chunks`).
- [ ] **AC3**: Given `deletion_mode: filter-and-delete` e `compaction_interval: 10m` habilitados, when o compactor executa, then logs do container Loki mostram mensagens de compaction sem erros (`docker logs loki 2>&1 | grep -i compactor`).
- [ ] **AC4**: Given Grafana 11.5.2 com datasource provisionado e Loki rodando, when o usuário acessa Grafana Explore e executa `{job=~".+"}`, then resultados são retornados do datasource Loki.
- [ ] **AC5**: Given Dockerfile com `nginx:1.27.4-alpine`, `apk add apache2-utils gettext`, when o container nginx sobe, then: (a) `envsubst` processa o template sem erros, (b) `htpasswd -c -b` cria o arquivo de credenciais, (c) o proxy responde com 401 para requests sem credenciais e 200 com credenciais válidas.
- [ ] **AC6**: Given stack atualizada sem mudanças nas portas ou credenciais, when os Docker logging plugins das VMs enviam logs via Nginx basic auth na porta `${PORT_LOKI}`, then os logs aparecem no Loki com labels `compose_project` corretos.
- [ ] **AC7**: Given o script `upgrade.sh` executado, when `docker compose pull` ou `docker compose build` falha, then a stack original continua rodando e nenhum volume é destruído.
- [ ] **AC8**: Given o script `upgrade.sh` executado com sucesso, when todos os containers sobem, then `docker compose ps` mostra todos os serviços como `healthy` ou `running`.
- [ ] **AC9**: Given Grafana 11.5.2 com variáveis `GF_AUTH_GITLAB_*`, when o usuário acessa a tela de login do Grafana, then a opção de login via GitLab é apresentada e funciona.
- [ ] **AC10**: Given `upgrade.sh` com `--wait-timeout 120`, when um container entra em restart loop (ex: config inválida), then o script falha com timeout após 120s ao invés de travar indefinidamente.

## Additional Context

### Dependencies

- Docker Engine >= 24.x nos servidores
- Docker Compose >= 2.1.1 (necessário para `--wait` flag)
- Acesso ao Docker Hub para pull das imagens (`grafana/loki:3.4.1`, `grafana/grafana:11.5.2`, `nginx:1.27.4-alpine`)
- Volume externo `${VOLUME_LOKI}` será recriado pelo `upgrade.sh`
- Volume externo `${VOLUME_GRAFANA}` permanece inalterado

### Testing Strategy

1. **Config validation** (pré-deploy): `docker run --rm -v "${PWD}":/config grafana/loki:3.4.1 -config.file=/config/loki-config.yaml -verify-config=true` (sem flag `-t` para compatibilidade com CI)
2. **Dockerfile build**: `docker compose build` — verificar que `apk add apache2-utils gettext` resolve sem erros
3. **envsubst check**: `docker compose up nginx` — verificar nos logs que `envsubst` processou o template e `htpasswd` criou o arquivo
4. **Stack deploy**: `docker compose up -d --wait` — verificar que todos os containers atingem healthy/running
5. **Volume persistence**: `docker exec loki ls -la /loki/` — confirmar diretórios chunks, index, retention
6. **Log ingestion**: `curl -u "${USERNAME}:${PASSWORD}" http://localhost:${PORT_LOKI}/loki/api/v1/labels` — verificar resposta 200 via Nginx basic auth (nota: Loki não é acessível diretamente no host na porta 3100 — apenas via Nginx)
7. **Grafana datasource**: Acessar Grafana Explore → verificar que datasource "Loki" existe (via provisioning) e queries retornam dados
8. **Grafana OAuth**: Acessar tela de login do Grafana → verificar que opção GitLab aparece
9. **Compactor**: `docker logs loki 2>&1 | grep -i compactor` — verificar execução sem erros
10. **Safe upgrade**: Testar cenário de falha — alterar temporariamente uma tag para versão inexistente, executar `upgrade.sh`, confirmar que a stack não é destruída

### Notes

- A data `from: 2020-10-24` no `schema_config` é a data original já presente na config — manter inalterada.
- Em produção, o procedimento é idêntico — só mudam os valores em `.env`.
- O healthcheck existente (`wget --quiet ... /ready`) é compatível com Loki 3.4.1.
- O `upgrade.sh` antigo fazia `apt update && apt upgrade && apt dist-upgrade` no host OS. Isso foi **intencionalmente removido** — patching do host não deve ser acoplado ao upgrade da stack de containers. Se necessário, fazer separadamente.
- A imagem `grafana/loki:3.4.1` não possui conteúdo pré-existente em `/loki` (binário está em `/usr/bin/loki`). Mount do volume em `/loki` é seguro.
- As credenciais no `.env.example` original (strings de 64 caracteres) já estão no git history e não podem ser removidas retroativamente. Se foram usadas em produção, devem ser rotacionadas.

### Adversarial Review Disposition

| Finding | Disposition |
| ------- | ----------- |
| F1 (Critical): envsubst no Alpine | **Corrigido** — `apk add gettext` no Dockerfile |
| F2 (High): upgrade.sh sem rollback real | **Corrigido** — pull/build ANTES de destruir, check de volume removal |
| F3 (High): mount em /loki pode mascarar | **Validado** — imagem oficial não tem conteúdo em /loki |
| F4 (High): Grafana 11 OAuth breaking | **Validado** — GF_AUTH_GITLAB_* compatível v9-v12 (docs). AC9 adicionado |
| F5 (High): volume rm silencioso | **Corrigido** — check explícito após rm com mensagem de erro |
| F6 (Medium): line numbers errados | **Corrigido** — removidos, usando string matching |
| F7 (Medium): delete_request_store deprecated | **Invalidado** — confirmado na doc oficial como configuração corrente |
| F8 (Medium): htpasswd relative path | **Corrigido** — path absoluto em nginx-basic-auth.conf |
| F9 (Medium): host patching removido | **Documentado** — nota explícita sobre remoção intencional |
| F10 (Medium): healthcheck timing | **Corrigido** — AC1 reflete timing real (40s) |
| F11 (Medium): datasource não provisionado | **Corrigido** — Task 5 adiciona provisioning YAML |
| F12 (Medium): testing port 3100 | **Corrigido** — testing via Nginx porta ${PORT_LOKI}, split-access documentado |
| F13 (Low): rules_directory sem ruler | **Corrigido** — removido da config |
| F14 (Low): .env.example com credenciais | **Corrigido** — Task 6 sanitiza valores |
| F15 (Low): proxy_read_timeout 900 | **Documentado** — adequado para LogQL queries longas |
| F16 (Low): -t flag em CI | **Corrigido** — removido da testing strategy |
| F17 (Low): Docker Compose version | **Corrigido** — >= 2.1.1 especificado |
| F18 (Low): floating tag nginx | **Corrigido** — tag exata `1.27.4-alpine` |
| F19 (Low): set -e sem -x | **Corrigido** — `set -xe` restaurado |

#### Second-Pass Findings (F20-F33)

| Finding | Disposition |
| ------- | ----------- |
| F20 (High): envsubst sem lista explícita | **Corrigido** — Task 3b: `run.sh` com `envsubst '${FORWARD_HOST} ${FORWARD_PORT}'` |
| F21 (High): `.env` sourcing com metacaracteres | **Corrigido** — `upgrade.sh` usa `grep/cut` ao invés de `. ./.env` |
| F22 (High): bind mount oculta provisioning | **Corrigido** — mount apenas `datasources/`, não diretório pai |
| F28 (High): upgrade.sh não cria provisioning dir | **Corrigido** — check explícito no `upgrade.sh` + pré-requisito documentado |
| F25 (Medium): rules_directory remoção | **Documentado** — risco explícito com mitigação via `-verify-config` |
| F32 (Medium): --wait sem timeout | **Corrigido** — `--wait-timeout 120` adicionado. AC10 adicionado |
| F29 (Medium): git tracking do grafana/ | **Documentado** — ver nota abaixo |
| F33 (Low): AC1 timing math | **Corrigido** — 52s (inclui timeout 2s por retry) |
| F24 (Low): volume create sem labels | **Aceito** — cosmético, sem impacto funcional |
| F30 (Low): PORT_LOKI naming | **Aceito** — pré-existente, fora de scope deste upgrade |

#### Nota sobre Git Tracking

O novo diretório `grafana/provisioning/datasources/` e seu conteúdo devem ser commitados no git junto com as demais mudanças. Ao aplicar as Tasks 1-6, fazer `git add` explícito do novo diretório:
```bash
git add grafana/provisioning/datasources/loki.yaml
```
