import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Сохраняем Node-окружение для бэкенда
    setupFiles: ['./src/test/setup.ts'], // Обновили путь к файлу с глобальными настройками
    alias: {
      '@': './src', // Алиас для директории src
    },
    coverage: {
      provider: 'v8', // Используем v8 для покрытия кода
      reporter: ['text', 'json', 'html'],
      all: true, // Обеспечиваем покрытие всех файлов
    },
    pool: 'threads', // Используем пулы потоков для ускорения выполнения тестов
  },
});
