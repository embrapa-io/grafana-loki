/**
 * Prepared statements para CRUD das tabelas OAuth.
 *
 * Cada função recebe a instância do banco e retorna
 * o resultado da operação. Prepared statements são
 * criados sob demanda e cacheados pelo better-sqlite3.
 */

import type Database from 'better-sqlite3';

// =====================================================
// Tipos
// =====================================================

export interface OAuthClient {
    client_id: string;
    client_name: string;
    redirect_uris: string;
    grant_types: string;
    response_types: string;
    token_endpoint_auth_method: string;
    created_at: string;
}

export interface OAuthSession {
    id: string;
    code: string;
    code_challenge: string;
    code_challenge_method: string;
    client_id: string;
    redirect_uri: string;
    state: string | null;
    scope: string;
    user_jwt: string | null;
    jwt_expires_at: string | null;
    used: number;
    expires_at: string;
    created_at: string;
}

export interface AccessToken {
    token: string;
    client_id: string;
    user_jwt: string;
    jwt_expires_at: string;
    user_email: string;
    scope: string;
    expires_at: string;
    created_at: string;
}

export interface RefreshToken {
    token: string;
    client_id: string;
    access_token: string;
    user_jwt: string;
    jwt_expires_at: string;
    user_email: string;
    scope: string;
    expires_at: string;
    created_at: string;
}

// =====================================================
// Clientes OAuth
// =====================================================

export function insertClient(
    db: Database.Database,
    client: Pick<OAuthClient, 'client_id' | 'client_name' | 'redirect_uris'>
): void {
    db.prepare(
        `INSERT INTO oauth_clients (client_id, client_name, redirect_uris)
         VALUES (?, ?, ?)`
    ).run(client.client_id, client.client_name, client.redirect_uris);
}

export function findClientById(
    db: Database.Database,
    clientId: string
): OAuthClient | undefined {
    return db
        .prepare(`SELECT * FROM oauth_clients WHERE client_id = ?`)
        .get(clientId) as OAuthClient | undefined;
}

// =====================================================
// Sessões OAuth
// =====================================================

export function insertSession(
    db: Database.Database,
    session: Pick<
        OAuthSession,
        'id' | 'code' | 'code_challenge' | 'code_challenge_method' |
        'client_id' | 'redirect_uri' | 'state' | 'scope' | 'expires_at'
    >
): void {
    db.prepare(
        `INSERT INTO oauth_sessions
         (id, code, code_challenge, code_challenge_method,
          client_id, redirect_uri, state, scope, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
        session.id, session.code, session.code_challenge,
        session.code_challenge_method, session.client_id,
        session.redirect_uri, session.state, session.scope,
        session.expires_at
    );
}

export function findSessionById(
    db: Database.Database,
    sessionId: string
): OAuthSession | undefined {
    return db
        .prepare(`SELECT * FROM oauth_sessions WHERE id = ?`)
        .get(sessionId) as OAuthSession | undefined;
}

export function findSessionByCode(
    db: Database.Database,
    code: string
): OAuthSession | undefined {
    return db
        .prepare(`SELECT * FROM oauth_sessions WHERE code = ?`)
        .get(code) as OAuthSession | undefined;
}

export function updateSessionJwt(
    db: Database.Database,
    sessionId: string,
    userJwt: string,
    jwtExpiresAt: string
): void {
    db.prepare(
        `UPDATE oauth_sessions SET user_jwt = ?, jwt_expires_at = ? WHERE id = ?`
    ).run(userJwt, jwtExpiresAt, sessionId);
}

export function markSessionUsed(
    db: Database.Database,
    sessionId: string
): void {
    db.prepare(
        `UPDATE oauth_sessions SET used = 1 WHERE id = ?`
    ).run(sessionId);
}

// =====================================================
// Access Tokens
// =====================================================

export function insertAccessToken(
    db: Database.Database,
    token: Pick<
        AccessToken,
        'token' | 'client_id' | 'user_jwt' | 'jwt_expires_at' |
        'user_email' | 'scope' | 'expires_at'
    >
): void {
    db.prepare(
        `INSERT INTO access_tokens
         (token, client_id, user_jwt, jwt_expires_at, user_email, scope, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
        token.token, token.client_id, token.user_jwt,
        token.jwt_expires_at, token.user_email, token.scope,
        token.expires_at
    );
}

export function findAccessToken(
    db: Database.Database,
    token: string
): AccessToken | undefined {
    return db
        .prepare(`SELECT * FROM access_tokens WHERE token = ?`)
        .get(token) as AccessToken | undefined;
}

export function deleteAccessToken(
    db: Database.Database,
    token: string
): void {
    db.prepare(`DELETE FROM access_tokens WHERE token = ?`).run(token);
}

// =====================================================
// Refresh Tokens
// =====================================================

export function insertRefreshToken(
    db: Database.Database,
    token: Pick<
        RefreshToken,
        'token' | 'client_id' | 'access_token' | 'user_jwt' |
        'jwt_expires_at' | 'user_email' | 'scope' | 'expires_at'
    >
): void {
    db.prepare(
        `INSERT INTO refresh_tokens
         (token, client_id, access_token, user_jwt, jwt_expires_at, user_email, scope, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
        token.token, token.client_id, token.access_token,
        token.user_jwt, token.jwt_expires_at, token.user_email,
        token.scope, token.expires_at
    );
}

export function findRefreshToken(
    db: Database.Database,
    token: string
): RefreshToken | undefined {
    return db
        .prepare(`SELECT * FROM refresh_tokens WHERE token = ?`)
        .get(token) as RefreshToken | undefined;
}

export function deleteRefreshToken(
    db: Database.Database,
    token: string
): void {
    db.prepare(`DELETE FROM refresh_tokens WHERE token = ?`).run(token);
}

export function deleteRefreshTokensByAccessToken(
    db: Database.Database,
    accessToken: string
): void {
    db.prepare(
        `DELETE FROM refresh_tokens WHERE access_token = ?`
    ).run(accessToken);
}

// =====================================================
// Cleanup de tokens expirados
// =====================================================

export interface CleanupResult {
    sessions: number;
    accessTokens: number;
    refreshTokens: number;
}

/**
 * Remove registros expirados de todas as tabelas OAuth.
 * Executa em transação para atomicidade.
 */
export function cleanupExpired(db: Database.Database): CleanupResult {
    const cleanup = db.transaction(() => {
        const refreshResult = db.prepare(
            `DELETE FROM refresh_tokens WHERE expires_at < datetime('now')`
        ).run();

        const accessResult = db.prepare(
            `DELETE FROM access_tokens WHERE expires_at < datetime('now')`
        ).run();

        const sessionResult = db.prepare(
            `DELETE FROM oauth_sessions WHERE expires_at < datetime('now')`
        ).run();

        return {
            sessions: sessionResult.changes,
            accessTokens: accessResult.changes,
            refreshTokens: refreshResult.changes,
        };
    });

    return cleanup() as CleanupResult;
}
