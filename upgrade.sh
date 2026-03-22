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
echo "  - Loki:    curl -u USER:PASS http://localhost:$(grep PORT_LOKI .env | cut -d= -f2)/ready"
echo "  - Grafana: http://localhost:$(grep PORT_GRAFANA .env | cut -d= -f2)"
echo "  - MCP:     curl http://localhost:$(grep PORT_MCP .env | cut -d= -f2)/health"
echo ""
echo "Rollback:"
echo "  git checkout -- docker-compose.yml Dockerfile loki-config.yaml run.sh nginx-basic-auth.conf .env.example"
echo "  rm -rf grafana/provisioning"
echo "  docker compose down"
echo "  docker volume rm ${VOLUME_LOKI} 2>/dev/null; docker volume create ${VOLUME_LOKI}"
echo "  docker compose pull && docker compose build --no-cache"
echo "  docker compose up -d --wait --wait-timeout 120"
