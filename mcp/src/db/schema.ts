/**
 * DDL do schema SQLite para persistência OAuth.
 *
 * Tabelas: oauth_clients, oauth_sessions, access_tokens, refresh_tokens.
 * Copiado do ../mcp — mesmo schema.
 */

/** Criação das tabelas OAuth */
export const SCHEMA_DDL = `
-- Clientes OAuth registrados via Dynamic Client Registration
CREATE TABLE IF NOT EXISTS oauth_clients (
    client_id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    redirect_uris TEXT NOT NULL,
    grant_types TEXT NOT NULL DEFAULT '["authorization_code","refresh_token"]',
    response_types TEXT NOT NULL DEFAULT '["code"]',
    token_endpoint_auth_method TEXT NOT NULL DEFAULT 'none',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Sessões de autorização (vida curta: 10 minutos)
CREATE TABLE IF NOT EXISTS oauth_sessions (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    code_challenge TEXT NOT NULL,
    code_challenge_method TEXT NOT NULL DEFAULT 'S256',
    client_id TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    state TEXT,
    scope TEXT DEFAULT 'mcp:full',
    user_jwt TEXT,
    jwt_expires_at TEXT,
    used INTEGER NOT NULL DEFAULT 0,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_code ON oauth_sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON oauth_sessions(expires_at);

-- Access tokens emitidos
CREATE TABLE IF NOT EXISTS access_tokens (
    token TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    user_jwt TEXT NOT NULL,
    jwt_expires_at TEXT NOT NULL,
    user_email TEXT NOT NULL,
    scope TEXT DEFAULT 'mcp:full',
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id)
);

CREATE INDEX IF NOT EXISTS idx_access_tokens_expires ON access_tokens(expires_at);

-- Refresh tokens emitidos
CREATE TABLE IF NOT EXISTS refresh_tokens (
    token TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    user_jwt TEXT NOT NULL,
    jwt_expires_at TEXT NOT NULL,
    user_email TEXT NOT NULL,
    scope TEXT DEFAULT 'mcp:full',
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id),
    FOREIGN KEY (access_token) REFERENCES access_tokens(token)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_access ON refresh_tokens(access_token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);
`;
