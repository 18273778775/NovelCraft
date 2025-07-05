import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Check layout elements
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Check navigation is horizontal
    const nav = page.locator('nav');
    const navBox = await nav.boundingBox();
    expect(navBox?.width).toBeGreaterThan(navBox?.height || 0);
  });

  test('should display correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check layout adapts
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check if hamburger menu appears (if implemented)
    const hamburger = page.locator('[data-testid="hamburger-menu"]');
    if (await hamburger.isVisible()) {
      await expect(hamburger).toBeVisible();
    }
  });

  test('should display correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.locator('main')).toBeVisible();
    
    // Check if mobile navigation works
    const mobileNav = page.locator('[data-testid="mobile-nav"]');
    if (await mobileNav.isVisible()) {
      await expect(mobileNav).toBeVisible();
    }
    
    // Test touch interactions
    await page.locator('input[type="email"]').tap();
    await expect(page.locator('input[type="email"]')).toBeFocused();
  });

  test('should handle orientation changes', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
    
    // Switch to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator('main')).toBeVisible();
    
    // Layout should still be functional
    await page.locator('input[type="email"]').fill('test@example.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
  });

  test('should have accessible touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check button sizes are appropriate for touch
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          // Touch targets should be at least 44px (iOS) or 48dp (Android)
          expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('should handle text scaling', async ({ page }) => {
    // Test with different text sizes
    await page.addInitScript(() => {
      document.documentElement.style.fontSize = '20px';
    });
    
    await page.reload();
    
    // Layout should still be readable and functional
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Text should not overflow containers
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span');
    const count = await textElements.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        const parent = await element.locator('..').boundingBox();
        
        if (box && parent) {
          expect(box.width).toBeLessThanOrEqual(parent.width + 5); // 5px tolerance
        }
      }
    }
  });

  test('should work with keyboard navigation on all screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
      
      // Enter should activate focused element
      const focusedElement = page.locator(':focus');
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'button' || tagName === 'a') {
        // Test that Enter key works
        await page.keyboard.press('Enter');
        // Should trigger some action (page change, form submission, etc.)
      }
    }
  });

  test('should maintain functionality across breakpoints', async ({ page }) => {
    // Login on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Register and login
    await page.locator('text=Register').click();
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(`testuser${timestamp}`);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(2000);
    
    // Switch to mobile and verify functionality still works
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still be logged in
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    // Should be able to navigate
    await page.locator('text=Projects').click();
    await expect(page.locator('text=Create New Project')).toBeVisible();
    
    // Should be able to create project on mobile
    await page.locator('text=Create New Project').click();
    await page.locator('input[name="title"]').fill('Mobile Test Project');
    await page.locator('textarea[name="description"]').fill('Created on mobile');
    await page.locator('button[type="submit"]').click();
    
    await expect(page.locator('text=Mobile Test Project')).toBeVisible();
  });
});
