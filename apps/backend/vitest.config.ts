import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Для юнит-тестов не нужен E2E setup
    // Если понадобится для интеграционных, добавим позже
  },
});
