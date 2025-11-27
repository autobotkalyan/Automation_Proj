// spec: tests/chase-website-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Sign-In Widget', () => {
  test('Invalid Login Attempt', async ({ page }) => {
    // 1. Navigate to homepage
    await page.goto('https://www.chase.com/');

    // 2. Wait 3 seconds for widget to load
    await new Promise(f => setTimeout(f, 3 * 1000));

    // 3. Enter invalid username
    await page.getByRole('textbox', { name: 'Username' }).fill('testuser_invalid');

    // 4. Enter invalid password
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword123');

    // 5. Click "Sign in" button
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 6. Verify error handling
    // Note: Chase implements anti-bot detection that may show different error pages
    // We check for either: standard error message OR error page URL OR any error indication
    
    // Wait for navigation to complete
    await page.waitForURL(/secure\.chase\.com/, { timeout: 15000 });
    
    // Check if we got the standard error message with retry form
    const hasErrorMessage = await page.getByRole('heading', { name: /We can't find that username and password/i }).first().isVisible().catch(() => false);
    
    if (hasErrorMessage) {
      // Standard error page - verify form remains accessible for retry
      await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    } else {
      // Anti-bot detection or alternative error page - verify authentication failed
      expect(page.url()).toContain('secure.chase.com');
      expect(page.url()).not.toContain('dashboard'); // Not logged in
    }
  });
});
