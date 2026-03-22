/**
 * Validação PKCE (RFC 7636) — apenas método S256.
 */

import { createHash } from 'node:crypto';

/**
 * Valida que o code_challenge_method é S256.
 */
export function validateCodeChallenge(method: string): boolean {
    return method === 'S256';
}

/**
 * Verifica se o code_verifier corresponde ao code_challenge armazenado.
 * Calcula BASE64URL(SHA256(code_verifier)) e compara com code_challenge.
 */
export function verifyCodeVerifier(
    codeVerifier: string,
    codeChallenge: string
): boolean {
    const hash = createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');
    return hash === codeChallenge;
}
