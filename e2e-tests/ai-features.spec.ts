import { test, expect } from '@playwright/test';

test.describe('AI Features', () => {
  test.beforeEach(async ({ page }) => {
    // Login and create a project with chapters
    await page.goto('/');
    
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
    
    // Wait for login
    await page.waitForTimeout(2000);
    
    // Create a project
    await page.locator('text=Projects').click();
    await page.locator('text=Create New Project').click();
    
    const projectTitle = `AI Test Project ${timestamp}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('Project for AI testing');
    await page.locator('button[type="submit"]').click();
    
    // Wait for project creation
    await page.waitForTimeout(1000);
    
    // Enter the project
    await page.locator(`text=${projectTitle}`).click();
    
    // Create a chapter
    await page.locator('text=Add Chapter').click();
    await page.locator('input[name="title"]').fill('Test Chapter');
    await page.locator('textarea[name="content"]').fill('这是一个测试章节的内容，需要进行AI润色。文字比较粗糙，希望能够变得更加优美。');
    await page.locator('button[type="submit"]').click();
    
    // Wait for chapter creation
    await page.waitForTimeout(1000);
  });

  test('should display AI polish options', async ({ page }) => {
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Should see AI polish button
    await expect(page.locator('text=AI Polish')).toBeVisible();
    
    // Click AI polish
    await page.locator('text=AI Polish').click();
    
    // Should see polish options
    await expect(page.locator('text=Style')).toBeVisible();
    await expect(page.locator('text=Focus')).toBeVisible();
    await expect(page.locator('text=Provider')).toBeVisible();
  });

  test('should perform text polishing with DeepSeek', async ({ page }) => {
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Select text to polish
    await page.locator('textarea[name="content"]').selectText();
    
    // Click AI polish
    await page.locator('text=AI Polish').click();
    
    // Select DeepSeek provider
    await page.locator('select[name="provider"]').selectOption('deepseek');
    
    // Select literary style
    await page.locator('select[name="style"]').selectOption('literary');
    
    // Start polishing
    await page.locator('button[text="Polish Text"]').click();
    
    // Should show loading state
    await expect(page.locator('text=Polishing...')).toBeVisible();
    
    // Wait for result (with timeout)
    await page.waitForSelector('text=Polish Complete', { timeout: 30000 });
    
    // Should show polished text
    await expect(page.locator('.polished-result')).toBeVisible();
    
    // Should have apply button
    await expect(page.locator('button[text="Apply Changes"]')).toBeVisible();
  });

  test('should perform text rewriting with Doubao', async ({ page }) => {
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Select text to rewrite
    await page.locator('textarea[name="content"]').selectText();
    
    // Click AI rewrite
    await page.locator('text=AI Rewrite').click();
    
    // Select Doubao provider
    await page.locator('select[name="provider"]').selectOption('doubao');
    
    // Select humorous tone
    await page.locator('select[name="tone"]').selectOption('humorous');
    
    // Select longer length
    await page.locator('select[name="length"]').selectOption('longer');
    
    // Start rewriting
    await page.locator('button[text="Rewrite Text"]').click();
    
    // Should show loading state
    await expect(page.locator('text=Rewriting...')).toBeVisible();
    
    // Wait for result
    await page.waitForSelector('text=Rewrite Complete', { timeout: 30000 });
    
    // Should show rewritten text
    await expect(page.locator('.rewrite-result')).toBeVisible();
  });

  test('should get AI suggestions', async ({ page }) => {
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Click AI suggestions
    await page.locator('text=AI Suggestions').click();
    
    // Select context
    await page.locator('select[name="context"]').selectOption('fantasy');
    
    // Get suggestions
    await page.locator('button[text="Get Suggestions"]').click();
    
    // Should show loading state
    await expect(page.locator('text=Analyzing...')).toBeVisible();
    
    // Wait for suggestions
    await page.waitForSelector('text=Suggestions Ready', { timeout: 30000 });
    
    // Should show suggestions list
    await expect(page.locator('.suggestions-list')).toBeVisible();
    await expect(page.locator('.suggestion-item')).toHaveCount.greaterThan(0);
  });

  test('should perform text analysis', async ({ page }) => {
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Click AI analysis
    await page.locator('text=AI Analysis').click();
    
    // Select analysis aspects
    await page.locator('input[value="style"]').check();
    await page.locator('input[value="mood"]').check();
    await page.locator('input[value="structure"]').check();
    
    // Start analysis
    await page.locator('button[text="Analyze Text"]').click();
    
    // Should show loading state
    await expect(page.locator('text=Analyzing...')).toBeVisible();
    
    // Wait for analysis
    await page.waitForSelector('text=Analysis Complete', { timeout: 30000 });
    
    // Should show analysis results
    await expect(page.locator('.analysis-results')).toBeVisible();
    await expect(page.locator('.style-analysis')).toBeVisible();
    await expect(page.locator('.mood-analysis')).toBeVisible();
    await expect(page.locator('.structure-analysis')).toBeVisible();
  });

  test('should handle AI service errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/ai/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' })
      });
    });
    
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Try to polish text
    await page.locator('text=AI Polish').click();
    await page.locator('button[text="Polish Text"]').click();
    
    // Should show error message
    await expect(page.locator('text=AI service is currently unavailable')).toBeVisible();
    
    // Should have retry button
    await expect(page.locator('button[text="Retry"]')).toBeVisible();
  });

  test('should save AI results to chapter', async ({ page }) => {
    // Click on the chapter to edit
    await page.locator('text=Test Chapter').click();
    
    // Get original content
    const originalContent = await page.locator('textarea[name="content"]').inputValue();
    
    // Polish text
    await page.locator('textarea[name="content"]').selectText();
    await page.locator('text=AI Polish').click();
    await page.locator('button[text="Polish Text"]').click();
    
    // Wait for result
    await page.waitForSelector('text=Polish Complete', { timeout: 30000 });
    
    // Apply changes
    await page.locator('button[text="Apply Changes"]').click();
    
    // Save chapter
    await page.locator('button[text="Save Chapter"]').click();
    
    // Verify content has changed
    const newContent = await page.locator('textarea[name="content"]').inputValue();
    expect(newContent).not.toBe(originalContent);
    
    // Should show save success message
    await expect(page.locator('text=Chapter saved successfully')).toBeVisible();
  });
});
