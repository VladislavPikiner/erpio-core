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

### 📦 Adding a New Package

1. Create a new folder in `packages/` or `apps/`.
2. Initialize `package.json`:
   ```bash
   cd packages/<new-package>
   pnpm init
   ```
3. Add the package to `pnpm-workspace.yaml`.
4. Install dependencies:
   ```bash
   pnpm install
   ```

### 🔗 Adding Dependencies Between Packages

- Add a dependency from one package to another (e.g., `@erpio/shared` in `@erpio/admin`):
  ```bash
  pnpm add @erpio/shared --filter=@erpio/admin
  ```

### 🧹 Cleaning and Rebuilding

- Clean the cache and rebuild the project:
  ```bash
  pnpm run clean
  pnpm run build
  ```

### 🔄 Working with Git

- Before committing, ensure all changes are tested and built:
  ```bash
  pnpm run build
  pnpm run test
  ```

- Commit changes:
  ```bash
  git add .
  git commit -m "<your-commit-message>"
  ```

- Push changes to the remote repository:
  ```bash
  git push origin main
  ```

### ⚠️ Troubleshooting

- **Build errors due to dependencies**:
  1. Clear the cache:
     ```bash
     pnpm run clean
     ```
  2. Reinstall dependencies:
     ```bash
     rm -rf node_modules
     pnpm install
     ```

- **Module resolution errors**:
  - Ensure all dependencies are installed (`pnpm install`).
  - Ensure all packages are built (`pnpm run build`).

- **TurboRepo issues**:
  1. Clear the cache:
     ```bash
     pnpm run clean
     ```
  2. Rebuild the project:
     ```bash
     pnpm run build
     ```

## 📚 Testing

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
pnpm exec playwright test
```

### Интеграционные тесты

Если требуется запустить интеграционные тесты, используйте:

```bash
# В директории @erpio/backend
cd apps/backend
pnpm run test:integration
```

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
