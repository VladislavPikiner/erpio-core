# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> should load the homepage
- Location: e2e/homepage.spec.ts:3:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected pattern: /Welcome/
Received string:  "Server Error"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h1')
    8 × locator resolved to <h1 id="nextjs__container_errors_label" class="nextjs__container_errors_label">Server Error</h1>
      - unexpected value "Server Error"

```

```yaml
- heading "Server Error" [level=1]
```

# Test source

```ts
  1 | import { test, expect } from '@playwright/test';
  2 | 
  3 | test('should load the homepage', async ({ page }) => {
  4 |   await page.goto('http://localhost:3002');
> 5 |   await expect(page.locator('h1')).toContainText(/Welcome/);
    |                                    ^ Error: expect(locator).toContainText(expected) failed
  6 | });
```