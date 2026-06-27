import './test/e2e/setup'; // Ensure setup runs first

// Import and run test suites sequentially
import './test/e2e/auth.e2e.spec';
import './test/e2e/branch.isolation.e2e.spec';
import './test/e2e/inventory.sales.e2e.spec';
import './test/e2e/fullflow.e2e.spec';

console.log('E2E tests execution started.');

// Note: Vitest itself manages test execution. This script just ensures setup.
// If this script completes without errors and Vitest exits cleanly, tests passed.
// If Vitest reported errors, they will be visible in the console output.
