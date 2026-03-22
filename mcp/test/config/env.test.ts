import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig } from '../../src/config/env.js';

describe('loadConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('loads valid configuration', () => {
        process.env.BACKEND_API_URL = 'https://api.embrapa.io';
        process.env.MCP_SERVER_URL = 'https://mcp-loki.embrapa.io';
        process.env.SESSION_SECRET = 'a'.repeat(32);

        const config = loadConfig();

        expect(config.BACKEND_API_URL).toBe('https://api.embrapa.io');
        expect(config.MCP_SERVER_URL).toBe('https://mcp-loki.embrapa.io');
        expect(['production', 'test', 'development']).toContain(config.NODE_ENV);
        expect(config.LOG_LEVEL).toBe('info'); // default
        expect(config.LOKI_URL).toBe('http://loki:3100'); // default
        expect(config.ACCESS_TOKEN_TTL).toBe(604800); // default
    });

    it('throws on missing required fields', () => {
        delete process.env.BACKEND_API_URL;
        delete process.env.MCP_SERVER_URL;
        delete process.env.SESSION_SECRET;

        expect(() => loadConfig()).toThrow('Falha na validação');
    });

    it('throws on SESSION_SECRET too short', () => {
        process.env.BACKEND_API_URL = 'https://api.embrapa.io';
        process.env.MCP_SERVER_URL = 'https://mcp-loki.embrapa.io';
        process.env.SESSION_SECRET = 'short';

        expect(() => loadConfig()).toThrow();
    });

    it('rejects placeholder SESSION_SECRET', () => {
        process.env.BACKEND_API_URL = 'https://api.embrapa.io';
        process.env.MCP_SERVER_URL = 'https://mcp-loki.embrapa.io';
        process.env.SESSION_SECRET = 'change-me-to-a-random-string';

        expect(() => loadConfig()).toThrow();
    });

    it('parses numeric values from environment', () => {
        process.env.BACKEND_API_URL = 'https://api.embrapa.io';
        process.env.MCP_SERVER_URL = 'https://mcp-loki.embrapa.io';
        process.env.SESSION_SECRET = 'a'.repeat(32);
        process.env.ACCESS_TOKEN_TTL = '3600';

        const config = loadConfig();
        expect(config.ACCESS_TOKEN_TTL).toBe(3600);
    });
});
