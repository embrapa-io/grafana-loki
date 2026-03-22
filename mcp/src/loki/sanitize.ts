/**
 * Sanitização de input para LogQL.
 *
 * Nunca concatenar input do usuário diretamente em LogQL.
 */

/**
 * Sanitiza input do usuário para uso seguro em LogQL.
 * Preserva | para buscas OR (ex: "error|warn") — é seguro dentro de |= "..."
 * Remove apenas caracteres que podem escapar do contexto de string LogQL.
 */
export function sanitizeLogQLInput(input: string): string {
    return input
        .replace(/[\r\n\t]/g, ' ')  // newlines e tabs → espaço (evita quebra de contexto)
        .replace(/[`"\\]/g, '')     // aspas e backticks (escapam de string)
        .replace(/[{}~=!<>]/g, '')  // operadores LogQL (NÃO remover |)
        .slice(0, 200);
}

/**
 * Valida que um slug de projeto contém apenas caracteres alfanuméricos e hífens.
 */
export function validateProjectSlug(slug: string): boolean {
    return /^[a-zA-Z0-9-]+$/.test(slug) && slug.length <= 64;
}

/**
 * Valida que um stage é um dos valores permitidos.
 */
export function validateStage(stage: string): stage is 'alpha' | 'beta' | 'release' {
    return ['alpha', 'beta', 'release'].includes(stage);
}
