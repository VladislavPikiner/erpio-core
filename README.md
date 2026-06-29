# erpio-core
Production-grade ERP core for grocery stores.
Architected for scalability, observability, and type-safety.

---

## 📦 Dependencies

- **pnpm** for package management.
- **TurboRepo** for monorepo orchestration.

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Run the development server:
   ```bash
   pnpm run dev
   ```
3. Build the project:
   ```bash
   pnpm run build
   ```

## 🛠 Development

- Use `pnpm run dev` to start all apps in development mode.
- Use `pnpm run build` to build all packages.
- Use `pnpm run test` to run all tests.

## 🔧 Working with TurboRepo

### 📌 Basic Commands

- **Install dependencies**:
  ```bash
  pnpm install
  ```

- **Run development servers**:
  ```bash
  pnpm run dev
  ```

- **Build all packages**:
  ```bash
  pnpm run build
  ```

- **Run tests**:
  ```bash
  pnpm run test
  ```

- **Clean the project**:
  ```bash
  pnpm run clean
  ```

- **Lint the project**:
  ```bash
  pnpm run lint
  ```

### 📌 Advanced Commands

- **Run a specific app**:
  ```bash
  pnpm run dev --filter=@erpio/admin
  ```

- **Build a specific package**:
  ```bash
  pnpm run build --filter=@erpio/shared
  ```

- **Run tests for a specific package**:
  ```bash
  pnpm run test --filter=@erpio/backend
  ```

## 📝 Testing

### Unit-тесты

Для запуска unit-тестов используйте `Vitest`:

```bash
# В директории @erpio/admin
cd apps/admin
pnpm run test
```

### E2E-тесты

Для запуска E2E-тестов используйте `Playwright`:

```bash
# В директории @erpio/admin
cd apps/admin
pnpm run dev &  # Запустите сервер Next.js
pnpm exec playwright test
```

### Интеграционные тесты

Если требуется запустить интеграционные тесты, используйте:

```bash
# В директории @erpio/backend
cd apps/backend
pnpm run test:integration
```

## 🔍 Технические долги и аудит

### Текущее состояние

- **Unit-тесты**: Настроены для `@erpio/admin` (компоненты и хуки).
- **E2E-тесты**: В процессе настройки (Playwright).
- **Интеграционные тесты**: Настроены для `@erpio/backend`.

### План аудита

1. **Проверка структуры проекта**: Выявление неиспользуемых файлов и зависимостей.
2. **Анализ архитектуры**: Проверка соответствия best practices (NestJS, Next.js, Prisma).
3. **Технические долги**: Заглушки, мусор, неиспользуемый код.
4. **План устранения**: Детальный план по исправлению замечаний.

> **Примечание**: Аудит будет проведён без внесения изменений в код. Отчёт будет предоставлен для утверждения.

## 📚 Documentation

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [pnpm](https://pnpm.io/)
- [TurboRepo](https://turbo.build/repo/docs)

---

## 📝 License

MIT