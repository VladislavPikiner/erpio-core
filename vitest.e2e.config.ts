import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@prisma/client': path.resolve(__dirname, 'apps/backend/prisma/generated/client'),
      '@prisma/adapter-pg': path.resolve(__dirname, 'node_modules/@prisma/adapter-pg'),
      'pg': path.resolve(__dirname, 'node_modules/pg'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test/e2e/setup.ts'],
    include: ['test/e2e/**/*.spec.ts', 'apps/backend/tests/**/*.test.ts'],
    env: {
      DATABASE_URL: "postgresql://postgres:password@localhost:5433/erpio_db?schema=public",
      JWT_SECRET: "super-secret-enterprise-key",
    },
  },
});
