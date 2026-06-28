import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5433/erpio_db?schema=public",
  },
});
