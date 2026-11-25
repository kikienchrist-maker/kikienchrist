import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
    },
    testTimeout: 60000,
    alias: {
      './parser.js': './parser.mock.ts',
      './changelog-wrapper.js': './changelog-wrapper.mock.ts',
    },
  },
});