# PROJECT_STATE.md - erpio-core

## Current Status: STABLE (Production-Grade)
**Last Update:** 2026-06-29

### 🛠 Infrastructure
- **Stack**: NestJS, GraphQL, Prisma 7.9.0-dev.13, PostgreSQL.
- **Monorepo**: pnpm workspaces + Turbo.
- **State**: Stable. E2E environment fully automated with idempotent seeds.
- **Test DB**: PostgreSQL on port 5433 (Docker).
  - **Credentials**: `postgres` / `password` (`postgresql://postgres:password@localhost:5433/erpio_db?schema=public`)
- **Prisma Config**: `prisma.config.ts` in root is mandatory for `prisma db push` in v7-dev.
- **Build**: `pnpm exec tsc --noEmit -p apps/backend/tsconfig.json` passes.

### 📦 Module Stability
- **Users**: Consolidated from `src/user` to `src/users`. Logic merged, `password.utils` restored. RBAC integrated.
- **Categories**: Stabilized.
- **Sales**: Logic and typings fixed (discount, variantId).
- **Inventory**: Stabilized.
- **Finance**: Stabilized.
- **Warehouses**: Resolver fixed, `WarehouseType` aligned with `@prisma/client`.

### 🔧 TypeScript Configuration
- **Issue**: Conflicting `moduleResolution` settings (`NodeNext` vs `Bundler`) causing `Debug Failure` in `tsc`.
- **Resolution**:
  - Split base `tsconfig` into `packages/typescript-config/base.json` (common settings), `node.json` (for Node.js packages), and `next.json` (for Next.js apps).
  - Updated all `tsconfig.json` to extend the appropriate base config.
  - Removed conflicting `compilerOptions` from individual `tsconfig.json` files, letting the base configs handle `module`, `moduleResolution`, `jsx`, etc.
  - Verified with `pnpm turbo run check-types` – all packages now pass type-checking.

### 🧪 Verification
- **Typing**: Full codebase type-check completed.
- **Git**: All changes committed and pushed to `main`.
- **E2E**: Vitest configured with idempotent seeding.
  - **Seed Strategy**: `upsert` used for all core entities in `test/e2e/setup.ts` to prevent `Unique constraint` errors during repeated runs.
  - **Auth Tests**: `/auth/register` and `/auth/login` fully verified and passing.

### 🚩 Pending / Next Steps
- [ ] Expand E2E coverage to other core modules (Sales, Inventory).
- [ ] Final performance profiling of the restored core.

---
**Architecture Note**: Strictly adhering to "No Patching" policy. All fixes applied through architectural alignment and type-safety.
