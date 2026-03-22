/**
 * EventStore persistente usando Valkey (compatível com Redis).
 *
 * Implementa a interface EventStore do SDK para persistir
 * eventos de sessões MCP, permitindo resumabilidade.
 */

import { randomUUID } from 'node:crypto';
import { Redis } from 'ioredis';
import type { JSONRPCMessage } from '@modelcontextprotocol/server';
import type { Logger } from 'pino';

type EventId = string;
type StreamId = string;

const KEY_PREFIX = 'mcp:events:';
const TTL_SECONDS = 86400; // 24h

export interface ValkeyEventStoreOptions {
    redis: Redis;
    logger: Logger;
}

export class ValkeyEventStore {
    private redis: Redis;
    private logger: Logger;

    constructor({ redis, logger }: ValkeyEventStoreOptions) {
        this.redis = redis;
        this.logger = logger;
    }

    /**
     * Armazena um evento associado a um stream.
     * Retorna o ID gerado para o evento.
     */
    async storeEvent(streamId: StreamId, message: JSONRPCMessage): Promise<EventId> {
        const eventId = randomUUID();
        const eventKey = `${KEY_PREFIX}event:${eventId}`;
        const streamKey = `${KEY_PREFIX}stream:${streamId}`;

        const pipeline = this.redis.pipeline();

        // Armazena o evento como hash
        pipeline.hset(eventKey, {
            streamId,
            message: JSON.stringify(message),
        });
        pipeline.expire(eventKey, TTL_SECONDS);

        // Adiciona o event ID à lista do stream
        pipeline.rpush(streamKey, eventId);
        pipeline.expire(streamKey, TTL_SECONDS);

        const results = await pipeline.exec();

        // Verifica se algum comando do pipeline falhou
        if (results) {
            for (const [err] of results) {
                if (err) {
                    this.logger.error({ streamId, eventId, err }, 'Erro ao armazenar evento no Valkey');
                    throw err;
                }
            }
        }

        this.logger.debug(
            { streamId, eventId },
            'Evento armazenado no Valkey'
        );

        return eventId;
    }

    /**
     * Resolve o streamId de um eventId.
     */
    async getStreamIdForEventId(eventId: EventId): Promise<StreamId | undefined> {
        const eventKey = `${KEY_PREFIX}event:${eventId}`;
        const streamId = await this.redis.hget(eventKey, 'streamId');
        return streamId ?? undefined;
    }

    /**
     * Reenvia eventos de um stream a partir de um lastEventId.
     * Signature compatível com EventStore do SDK.
     */
    async replayEventsAfter(
        lastEventId: EventId,
        { send }: { send: (eventId: EventId, message: JSONRPCMessage) => Promise<void> }
    ): Promise<StreamId> {
        // Resolve o streamId do lastEventId
        const streamId = await this.getStreamIdForEventId(lastEventId);
        if (!streamId) {
            throw new Error(`Stream não encontrado para eventId: ${lastEventId}`);
        }

        const streamKey = `${KEY_PREFIX}stream:${streamId}`;
        const allEventIds = await this.redis.lrange(streamKey, 0, -1);

        const idx = allEventIds.indexOf(lastEventId);
        const startIndex = idx !== -1 ? idx + 1 : 0;
        const eventsToReplay = allEventIds.slice(startIndex);

        for (const eventId of eventsToReplay) {
            const eventKey = `${KEY_PREFIX}event:${eventId}`;
            const messageStr = await this.redis.hget(eventKey, 'message');

            if (messageStr) {
                const message = JSON.parse(messageStr) as JSONRPCMessage;
                await send(eventId, message);
            }
        }

        this.logger.debug(
            { streamId, lastEventId, replayed: eventsToReplay.length },
            'Eventos reenviados após reconexão'
        );

        return streamId;
    }

    async disconnect(): Promise<void> {
        await this.redis.quit();
    }
}
