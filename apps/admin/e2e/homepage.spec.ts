import { test, expect } from '@playwright/test';

test('should load the homepage', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await expect(page.locator('h1')).toContainText(/Welcome/);
});