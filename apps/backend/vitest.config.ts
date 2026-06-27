import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['../../test/e2e/setup.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
