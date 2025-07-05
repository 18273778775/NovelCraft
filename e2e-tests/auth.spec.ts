import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/Novel Craft/);
    
    // Check if login form is visible
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit empty form
    await page.locator('button[type="submit"]').click();
    
    // Check for validation messages
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.locator('input[type="email"]').fill('invalid@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    
    // Check for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should register new user successfully', async ({ page }) => {
    // Navigate to register page
    await page.locator('text=Register').click();
    
    // Fill registration form
    const timestamp = Date.now();
    await page.locator('input[name="username"]').fill(`testuser${timestamp}`);
    await page.locator('input[name="email"]').fill(`test${timestamp}@example.com`);
    await page.locator('input[name="password"]').fill('password123');
    await page.locator('input[name="confirmPassword"]').fill('password123');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to dashboard or show success message
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // First register a user
    await page.locator('text=Register').click();
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(`testuser${timestamp}`);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    // Wait for registration to complete
    await page.waitForTimeout(1000);
    
    // Navigate back to login
    await page.goto('/');
    
    // Login with the registered credentials
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    // Should be redirected to dashboard
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.locator('text=Register').click();
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(`testuser${timestamp}`);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    // Wait for login
    await page.waitForTimeout(1000);
    
    // Logout
    await page.locator('text=Logout').click();
    
    // Should be redirected to login page
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
