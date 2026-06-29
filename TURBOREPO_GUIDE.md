# TurboRepo Guide for erpio-core

## 📌 Overview

This guide provides instructions for working with the **TurboRepo** monorepo structure in the `erpio-core` project.

## 🛠 Development Workflow

### 📦 Adding a New Package

1. Create a new folder in `packages/` or `apps/`:
   ```bash
   mkdir packages/<new-package>
   ```

2. Initialize `package.json`:
   ```bash
   cd packages/<new-package>
   pnpm init
   ```

3. Add the package to `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
     - 'packages/<new-package>'
   ```

4. Install dependencies:
   ```bash
   pnpm install
   ```

### 🔗 Adding Dependencies Between Packages

To add a dependency from one package to another (e.g., `@erpio/shared` in `@erpio/admin`):
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

## 🔍 Технические долги и аудит

### План аудита

1. **Проверка структуры проекта**:
   - Выявление неиспользуемых файлов и зависимостей.
   - Проверка дублирующихся модулей и пакетов.

2. **Анализ архитектуры**:
   - Проверка соответствия best practices (NestJS, Next.js, Prisma).
   - Анализ модульной структуры и зависимостей.

3. **Технические долги**:
   - Заглушки, мусор, неиспользуемый код.
   - Проверка на наличие устаревших зависимостей.

4. **План устранения**:
   - Детальный план по исправлению замечаний.
   - Приоритизация задач по устранению долгов.

> **Примечание**: Аудит будет проведён без внесения изменений в код. Отчёт будет предоставлен для утверждения.

## 📚 Documentation

- [TurboRepo Official Docs](https://turbo.build/repo/docs)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)