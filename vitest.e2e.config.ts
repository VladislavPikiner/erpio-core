import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/e2e/setup.ts'],
    globalSetup: ['./test/e2e/global-setup.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    include: ['test/e2e/**/*.spec.ts'],
  },
});
