import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: 'esm',
    dts: false,
    clean: true,
    outDir: 'dist',
    platform: 'node',
    target: 'node22',
    external: ['better-sqlite3', 'pino', 'pino-pretty', 'ioredis'],
    noExternal: [/.*/],
});
