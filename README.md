# Grafana Loki for Embrapa I/O

Configuração de deploy do Grafana Loki no ecossistema do Embrapa I/O.

## Deploy

```
docker volume create loki
docker volume create grafana

cp .env.example .env

docker compose up --force-recreate --build --remove-orphans --wait
```

## Referências

- https://grafana.com/docs/loki/latest/send-data/docker-driver/
- https://grafana.com/docs/loki/latest/send-data/docker-driver/configuration/
- https://www.drailing.net/2020/06/running-loki-and-grafana-on-docker-swarm/
- https://grafana.com/docs/loki/latest/operations/storage/retention/
- https://medium.com/@aditya.hilman_10961/enabling-log-retention-in-loki-with-compactor-fe3de2002b47
