# E2E Testing

This document outlines how to run the End-to-End (E2E) tests for the `erpio-core` application.

## Prerequisites

- Node.js v20+ installed.
- pnpm package manager installed (`npm install -g pnpm`).
- Project cloned and dependencies installed:
  ```bash
  git clone <repository-url>
  cd erpio-core
  pnpm install
  ```

## Running E2E Tests

E2E tests are executed using `ts-node` directly, bypassing Vite's transformation process to avoid compatibility issues.

1.  **Navigate to the project root**:
    ```bash
    cd /var/www/templates/erpio-core
    ```

2.  **Run the E2E test script**:
    ```bash
    pnpm exec ts-node ./run-e2e.ts
    ```

This command will:
- Register `ts-node` for TypeScript execution.
- Execute the `setup.ts` script to initialize the NestJS application and populate the mock database.
- Run all test suites (`auth.e2e.spec.ts`, `branch.isolation.e2e.spec.ts`, `inventory.sales.e2e.spec.ts`, `fullflow.e2e.spec.ts`) sequentially.

## Test Structure

- **Test files**: Located in `test/e2e/`.
- **Setup script**: `test/e2e/setup.ts` handles application bootstrapping and database seeding.
- **Execution script**: `run-e2e.ts` orchestrates the test runs.

## CI Integration

E2E tests are automatically run in the CI pipeline defined in `.github/workflows/e2e.yml`. This ensures that tests are executed on every push to the `main` branch and for every pull request targeting `main`.
