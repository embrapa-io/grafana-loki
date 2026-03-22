import { describe, it, expect } from 'vitest';
import {
    buildLogQL,
    buildErrorLogQL,
    buildStatsLogQL,
    parseSince,
    sinceToStartTime,
    calculateRangeInterval,
} from '../../src/loki/query-builder.js';

describe('buildLogQL', () => {
    it('builds selector for project only', () => {
        const result = buildLogQL({ project: 'myproj' });
        expect(result).toBe('{compose_project=~"myproj_[a-zA-Z0-9-]+_(alpha|beta|release)"}');
    });

    it('builds selector for project + app + stage', () => {
        const result = buildLogQL({ project: 'myproj', app: 'api', stage: 'release' });
        expect(result).toBe('{compose_project="myproj_api_release"}');
    });

    it('builds selector for project + app', () => {
        const result = buildLogQL({ project: 'myproj', app: 'api' });
        expect(result).toBe('{compose_project=~"myproj_api_(alpha|beta|release)"}');
    });

    it('builds selector for project + stage', () => {
        const result = buildLogQL({ project: 'myproj', stage: 'beta' });
        expect(result).toBe('{compose_project=~"myproj_[a-zA-Z0-9-]+_beta"}');
    });

    it('adds level filter', () => {
        const result = buildLogQL({ project: 'myproj', level: 'ERROR' });
        expect(result).toContain('|= "ERROR"');
    });

    it('adds search filter', () => {
        const result = buildLogQL({ project: 'myproj', search: 'timeout' });
        expect(result).toContain('|= "timeout"');
    });

    it('sanitizes search input', () => {
        const result = buildLogQL({ project: 'myproj', search: 'test`"injection' });
        expect(result).toContain('|= "testinjection"');
    });

    it('uses custom label name', () => {
        const result = buildLogQL({ project: 'myproj', labelName: 'custom_label' });
        expect(result).toContain('custom_label');
    });
});

describe('buildErrorLogQL', () => {
    it('includes error regex pattern', () => {
        const result = buildErrorLogQL({ project: 'myproj' });
        expect(result).toContain('|~ "(?i)(error|exception|fatal|panic|traceback|ECONNREFUSED|ETIMEDOUT)"');
    });

    it('adds custom pattern filter', () => {
        const result = buildErrorLogQL({ project: 'myproj', search: 'ECONNREFUSED' });
        expect(result).toContain('|= "ECONNREFUSED"');
    });
});

describe('buildStatsLogQL', () => {
    it('builds count_over_time query', () => {
        const result = buildStatsLogQL({ project: 'myproj', since: '24h' });
        expect(result).toMatch(/^count_over_time\(/);
        expect(result).toContain('myproj');
    });
});

describe('parseSince', () => {
    it('parses minutes', () => {
        expect(parseSince('30m')).toBe(30 * 60 * 1000);
    });

    it('parses hours', () => {
        expect(parseSince('1h')).toBe(60 * 60 * 1000);
        expect(parseSince('24h')).toBe(24 * 60 * 60 * 1000);
    });

    it('parses days', () => {
        expect(parseSince('7d')).toBe(7 * 24 * 60 * 60 * 1000);
    });

    it('defaults to 1h for invalid input', () => {
        expect(parseSince('invalid')).toBe(60 * 60 * 1000);
    });
});

describe('sinceToStartTime', () => {
    it('returns ISO string in the past', () => {
        const result = sinceToStartTime('1h');
        const timestamp = new Date(result).getTime();
        const now = Date.now();
        expect(now - timestamp).toBeGreaterThan(50 * 60 * 1000);
        expect(now - timestamp).toBeLessThan(70 * 60 * 1000);
    });
});

describe('calculateRangeInterval', () => {
    it('returns 1m for 1h', () => {
        expect(calculateRangeInterval('1h')).toBe('1m');
    });

    it('returns interval proportional to duration', () => {
        expect(calculateRangeInterval('24h')).toBe('24m');
    });

    it('returns minimum 1m', () => {
        expect(calculateRangeInterval('30m')).toBe('1m');
    });
});
