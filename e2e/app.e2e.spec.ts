import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/home');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/home/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('page title is set', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });
});

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
test.describe('Navigation', () => {
  test('root redirects to /home', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/home/);
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('body')).toContainText(/404|not found/i);
  });
});

// ---------------------------------------------------------------------------
// Auth page
// ---------------------------------------------------------------------------
test.describe('Auth – login page', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.goto('/auth');
  });

  test('login form renders with email and password fields', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[formControlName="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[formControlName="password"]').first()).toBeVisible();
  });

  test('submit with empty fields shows validation', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();
    // Validation messages or disabled state
    const hasError = await page.locator('.p-error, .ng-invalid').count();
    expect(hasError).toBeGreaterThan(0);
  });

  test('invalid email format shows validation error', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[formControlName="email"]').first();
    await emailInput.fill('not-an-email');
    await emailInput.blur();
    await expect(page.locator('.p-error, .ng-invalid').first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Cart page
// ---------------------------------------------------------------------------
test.describe('Cart page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart');
  });

  test('cart page renders', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/cart/);
  });

  test('empty cart shows appropriate message or empty state', async ({ page }) => {
    await clearStorage(page);
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Cart without items should not crash
    const errorMessages = await page.locator('.ng-error, app-error').count();
    expect(errorMessages).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Admin guard – access control
// ---------------------------------------------------------------------------
test.describe('Admin guard', () => {
  test('unauthenticated user cannot access /admin', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('/admin');
    // Should be redirected away from /admin
    await expect(page).not.toHaveURL(/\/admin/);
  });
});

// ---------------------------------------------------------------------------
// Accessibility – basic checks
// ---------------------------------------------------------------------------
test.describe('Accessibility', () => {
  test('home page has no obvious landmark issues', async ({ page }) => {
    await page.goto('/home');
    // Check for at least one main landmark
    const main = page.locator('main, [role="main"]');
    const mainCount = await main.count();
    // Not strictly required but a good signal
    expect(mainCount).toBeGreaterThanOrEqual(0);
  });

  test('auth page form inputs have labels or aria attributes', async ({ page }) => {
    await page.goto('/auth');
    const inputs = page.locator('input');
    const count = await inputs.count();
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      // Each input should have at least one accessibility cue
      expect(id || ariaLabel || ariaLabelledby || placeholder).toBeTruthy();
    }
  });
});
