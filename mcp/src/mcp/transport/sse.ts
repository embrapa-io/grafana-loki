/**
 * Transport SSE legado para compatibilidade com clientes MCP antigos.
 *
 * Implementa o padrão SSE clássico do MCP v1:
 * - GET /sse — estabelece conexão SSE, envia URL do endpoint de mensagens
 * - POST /messages?sessionId=xxx — recebe mensagens JSON-RPC do cliente
 */

import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import type {
    Transport,
    JSONRPCMessage,
    MessageExtraInfo,
    AuthInfo,
    RequestId,
} from '@modelcontextprotocol/server';

export interface SSEServerTransportOptions {
    baseUrl: string;
    messagesPath?: string;
}

export class SSEServerTransport implements Transport {
    private _sessionId: string;
    private _sseResponse: Response | null = null;
    private _authInfo: AuthInfo | undefined;
    private _baseUrl: string;
    private _messagesPath: string;

    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: <T extends JSONRPCMessage>(message: T, extra?: MessageExtraInfo) => void;

    get sessionId(): string {
        return this._sessionId;
    }

    constructor(options?: SSEServerTransportOptions) {
        this._sessionId = randomUUID();
        this._baseUrl = options?.baseUrl ?? '';
        this._messagesPath = options?.messagesPath ?? '/messages';
    }

    async start(): Promise<void> {
        // SSE transport não precisa de start explícito
    }

    async close(): Promise<void> {
        if (this._sseResponse) {
            this._sseResponse.end();
            this._sseResponse = null;
        }
        this.onclose?.();
    }

    async send(message: JSONRPCMessage, options?: { relatedRequestId?: RequestId }): Promise<void> {
        if (!this._sseResponse) {
            throw new Error('SSE connection not established');
        }

        const eventId = randomUUID();
        const data = JSON.stringify(message);

        this._sseResponse.write(`id: ${eventId}\nevent: message\ndata: ${data}\n\n`);
    }

    /**
     * Trata o request GET /sse — estabelece conexão SSE.
     */
    handleSseRequest(req: Request & { auth?: AuthInfo }, res: Response): void {
        // Captura authInfo do request inicial
        this._authInfo = req.auth;

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });

        this._sseResponse = res;

        // Envia URL do endpoint de mensagens
        const messagesUrl = `${this._baseUrl}${this._messagesPath}?sessionId=${this._sessionId}`;
        res.write(`event: endpoint\ndata: ${messagesUrl}\n\n`);

        // Cleanup na desconexão
        req.on('close', () => {
            this._sseResponse = null;
            this.onclose?.();
        });
    }

    /**
     * Trata o request POST /messages — recebe mensagens JSON-RPC do cliente.
     */
    handleMessageRequest(
        req: Request & { auth?: AuthInfo },
        res: Response,
        body: JSONRPCMessage
    ): void {
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') {
                headers.set(key, value);
            }
        }

        const authInfo = req.auth ?? this._authInfo;

        const extra: MessageExtraInfo = {
            requestInfo: { headers },
            authInfo,
        };

        this.onmessage?.(body, extra);

        res.status(202).json({ jsonrpc: '2.0', result: 'accepted' });
    }
}
