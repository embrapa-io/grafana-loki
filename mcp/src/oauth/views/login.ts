/**
 * Template HTML da tela de login (server-rendered).
 *
 * Página responsiva com logo Embrapa I/O, formulário de e-mail (OTP)
 * e mensagens de erro inline.
 */

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export interface LoginPageOptions {
    sessionId: string;
    step: 'email' | 'pin';
    email?: string;
    error?: string;
}

export function renderLoginPage(options: LoginPageOptions): string {
    const { sessionId, step, email, error } = options;

    const errorHtml = error
        ? `<div class="error">${escapeHtml(error)}</div>`
        : '';

    const emailValue = email ? escapeHtml(email) : '';

    const formContent =
        step === 'email'
            ? `
        <label for="email">e-Mail</label>
        <input type="email" id="email" name="email" placeholder="seu@email.embrapa.br"
               required autofocus autocomplete="email" />
        <button type="submit">Enviar código</button>
    `
            : `
        <p class="info">Código enviado para <strong>${emailValue}</strong></p>
        <input type="hidden" name="email" value="${emailValue}" />
        <label for="pin">Código de verificação</label>
        <input type="text" id="pin" name="pin" placeholder="000000"
               required autofocus autocomplete="one-time-code"
               maxlength="6" inputmode="numeric" />
        <button type="submit">Verificar</button>
    `;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login — Embrapa I/O MCP Loki</title>
    <link rel="icon" href="/oauth/assets/favicon.ico">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
               background: #f5f5f5; display: flex; justify-content: center; align-items: center;
               min-height: 100vh; padding: 1rem; }
        .card { background: white; border-radius: 12px; padding: 2rem; max-width: 400px;
                width: 100%; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 1.5rem; }
        .logo img { height: 48px; }
        .logo h1 { font-size: 1.1rem; color: #333; margin-top: 0.5rem; }
        .logo .subtitle { font-size: 0.85rem; color: #666; margin-top: 0.25rem; }
        label { display: block; font-size: 0.9rem; color: #555; margin-bottom: 0.3rem; }
        input[type="email"], input[type="text"] { width: 100%; padding: 0.75rem; border: 1px solid #ddd;
            border-radius: 8px; font-size: 1rem; margin-bottom: 1rem; }
        input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        button { width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none;
                 border-radius: 8px; font-size: 1rem; cursor: pointer; }
        button:hover { background: #1d4ed8; }
        .error { background: #fef2f2; color: #dc2626; padding: 0.75rem; border-radius: 8px;
                 margin-bottom: 1rem; font-size: 0.9rem; }
        .info { color: #555; font-size: 0.9rem; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">
            <img src="/oauth/assets/logo.svg" alt="Embrapa I/O">
            <h1>MCP Loki</h1>
            <p class="subtitle">Consulta de Logs</p>
        </div>
        ${errorHtml}
        <form method="POST" action="/oauth/login">
            <input type="hidden" name="session_id" value="${escapeHtml(sessionId)}" />
            <input type="hidden" name="step" value="${step === 'email' ? 'request_pin' : 'verify_pin'}" />
            ${formContent}
        </form>
    </div>
</body>
</html>`;
}

export function renderSuccessPage(redirectUri: string, queryString: string): string {
    const fullUrl = `${redirectUri}?${queryString}`;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=${escapeHtml(fullUrl)}">
    <title>Autenticação concluída</title>
</head>
<body>
    <p>Redirecionando...</p>
    <script>window.location.href = ${JSON.stringify(fullUrl)};</script>
</body>
</html>`;
}
