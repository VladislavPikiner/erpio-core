import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@prisma/client': path.resolve(__dirname, './apps/backend/prisma/generated/client'),
    },
  },
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
