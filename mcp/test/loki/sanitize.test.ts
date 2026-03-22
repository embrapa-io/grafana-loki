import { describe, it, expect } from 'vitest';
import { sanitizeLogQLInput, validateProjectSlug, validateStage } from '../../src/loki/sanitize.js';

describe('sanitizeLogQLInput', () => {
    it('removes backticks and double quotes', () => {
        expect(sanitizeLogQLInput('test`"value')).toBe('testvalue');
    });

    it('removes LogQL operators', () => {
        expect(sanitizeLogQLInput('test{foo=~"bar"}')).toBe('testfoobar');
    });

    it('preserves pipe for OR searches', () => {
        expect(sanitizeLogQLInput('error|warn')).toBe('error|warn');
    });

    it('preserves normal text', () => {
        expect(sanitizeLogQLInput('connection timeout')).toBe('connection timeout');
    });

    it('truncates to 200 characters', () => {
        const long = 'a'.repeat(300);
        expect(sanitizeLogQLInput(long)).toHaveLength(200);
    });

    it('removes backslashes', () => {
        expect(sanitizeLogQLInput('test\\nvalue')).toBe('testnvalue');
    });

    it('replaces newlines and tabs with spaces', () => {
        expect(sanitizeLogQLInput('line1\nline2\rline3\ttab')).toBe('line1 line2 line3 tab');
    });
});

describe('validateProjectSlug', () => {
    it('accepts valid slugs', () => {
        expect(validateProjectSlug('my-project')).toBe(true);
        expect(validateProjectSlug('project123')).toBe(true);
        expect(validateProjectSlug('a')).toBe(true);
    });

    it('rejects invalid slugs', () => {
        expect(validateProjectSlug('')).toBe(false);
        expect(validateProjectSlug('my_project')).toBe(false);
        expect(validateProjectSlug('my project')).toBe(false);
        expect(validateProjectSlug('a'.repeat(65))).toBe(false);
    });
});

describe('validateStage', () => {
    it('accepts valid stages', () => {
        expect(validateStage('alpha')).toBe(true);
        expect(validateStage('beta')).toBe(true);
        expect(validateStage('release')).toBe(true);
    });

    it('rejects invalid stages', () => {
        expect(validateStage('development')).toBe(false);
        expect(validateStage('production')).toBe(false);
        expect(validateStage('')).toBe(false);
    });
});
