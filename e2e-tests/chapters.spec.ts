import { test, expect } from '@playwright/test';

test.describe('Chapter Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and create a project
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
    
    const projectTitle = `Chapter Test Project ${timestamp}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('Project for chapter testing');
    await page.locator('button[type="submit"]').click();
    
    // Wait for project creation and enter project
    await page.waitForTimeout(1000);
    await page.locator(`text=${projectTitle}`).click();
  });

  test('should display empty chapters list', async ({ page }) => {
    // Should show empty state
    await expect(page.locator('text=No chapters yet')).toBeVisible();
    await expect(page.locator('text=Add Chapter')).toBeVisible();
  });

  test('should create new chapter', async ({ page }) => {
    // Click add chapter
    await page.locator('text=Add Chapter').click();
    
    // Fill chapter form
    const chapterTitle = `Chapter ${Date.now()}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('This is the content of the new chapter. It contains some text that will be used for testing.');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should see the new chapter in the list
    await expect(page.locator(`text=${chapterTitle}`)).toBeVisible();
  });

  test('should edit chapter content', async ({ page }) => {
    // Create a chapter first
    await page.locator('text=Add Chapter').click();
    const chapterTitle = `Chapter ${Date.now()}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('Original content');
    await page.locator('button[type="submit"]').click();
    
    // Wait for chapter creation
    await page.waitForTimeout(1000);
    
    // Click on the chapter to edit
    await page.locator(`text=${chapterTitle}`).click();
    
    // Edit content
    await page.locator('textarea[name="content"]').clear();
    await page.locator('textarea[name="content"]').fill('Updated content with more details and information.');
    
    // Save changes
    await page.locator('button[text="Save"]').click();
    
    // Should show success message
    await expect(page.locator('text=Chapter saved')).toBeVisible();
    
    // Verify content is updated
    const content = await page.locator('textarea[name="content"]').inputValue();
    expect(content).toContain('Updated content');
  });

  test('should reorder chapters', async ({ page }) => {
    // Create multiple chapters
    const chapters = ['Chapter One', 'Chapter Two', 'Chapter Three'];
    
    for (const title of chapters) {
      await page.locator('text=Add Chapter').click();
      await page.locator('input[name="title"]').fill(title);
      await page.locator('textarea[name="content"]').fill(`Content for ${title}`);
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
    }
    
    // Should see all chapters in order
    const chapterList = page.locator('.chapter-list .chapter-item');
    await expect(chapterList.first()).toContainText('Chapter One');
    await expect(chapterList.nth(1)).toContainText('Chapter Two');
    await expect(chapterList.nth(2)).toContainText('Chapter Three');
    
    // Drag and drop to reorder (if drag-drop is implemented)
    // This would require specific implementation details
    // For now, we'll test using move up/down buttons if they exist
    await page.locator('[data-testid="move-down-Chapter Two"]').click();
    
    // Verify new order
    await expect(chapterList.first()).toContainText('Chapter One');
    await expect(chapterList.nth(1)).toContainText('Chapter Three');
    await expect(chapterList.nth(2)).toContainText('Chapter Two');
  });

  test('should delete chapter', async ({ page }) => {
    // Create a chapter first
    await page.locator('text=Add Chapter').click();
    const chapterTitle = `Chapter to Delete ${Date.now()}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('This chapter will be deleted');
    await page.locator('button[type="submit"]').click();
    
    // Wait for chapter creation
    await page.waitForTimeout(1000);
    
    // Delete the chapter
    await page.locator(`[data-testid="delete-${chapterTitle}"]`).click();
    
    // Confirm deletion
    await page.locator('button[text="Delete"]').click();
    
    // Chapter should no longer be visible
    await expect(page.locator(`text=${chapterTitle}`)).not.toBeVisible();
    
    // Should show empty state if no other chapters
    await expect(page.locator('text=No chapters yet')).toBeVisible();
  });

  test('should search chapters', async ({ page }) => {
    // Create multiple chapters with different content
    const chapters = [
      { title: 'Adventure Chapter', content: 'The hero embarked on a great adventure' },
      { title: 'Romance Chapter', content: 'A beautiful love story unfolded' },
      { title: 'Mystery Chapter', content: 'Strange things began to happen' }
    ];
    
    for (const chapter of chapters) {
      await page.locator('text=Add Chapter').click();
      await page.locator('input[name="title"]').fill(chapter.title);
      await page.locator('textarea[name="content"]').fill(chapter.content);
      await page.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
    }
    
    // Search for specific chapter
    await page.locator('input[placeholder="Search chapters"]').fill('Adventure');
    
    // Should show only the adventure chapter
    await expect(page.locator('text=Adventure Chapter')).toBeVisible();
    await expect(page.locator('text=Romance Chapter')).not.toBeVisible();
    await expect(page.locator('text=Mystery Chapter')).not.toBeVisible();
    
    // Clear search
    await page.locator('input[placeholder="Search chapters"]').clear();
    
    // Should show all chapters again
    await expect(page.locator('text=Adventure Chapter')).toBeVisible();
    await expect(page.locator('text=Romance Chapter')).toBeVisible();
    await expect(page.locator('text=Mystery Chapter')).toBeVisible();
  });

  test('should auto-save chapter content', async ({ page }) => {
    // Create a chapter
    await page.locator('text=Add Chapter').click();
    const chapterTitle = `Auto Save Chapter ${Date.now()}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('Initial content');
    await page.locator('button[type="submit"]').click();
    
    // Wait for chapter creation
    await page.waitForTimeout(1000);
    
    // Click on the chapter to edit
    await page.locator(`text=${chapterTitle}`).click();
    
    // Type additional content
    await page.locator('textarea[name="content"]').fill('Initial content with auto-saved changes');
    
    // Wait for auto-save (if implemented)
    await page.waitForTimeout(3000);
    
    // Should show auto-save indicator
    await expect(page.locator('text=Auto-saved')).toBeVisible();
    
    // Refresh page and verify content is saved
    await page.reload();
    await page.locator(`text=${chapterTitle}`).click();
    
    const content = await page.locator('textarea[name="content"]').inputValue();
    expect(content).toContain('auto-saved changes');
  });

  test('should export chapter', async ({ page }) => {
    // Create a chapter
    await page.locator('text=Add Chapter').click();
    const chapterTitle = `Export Chapter ${Date.now()}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('This chapter will be exported to various formats.');
    await page.locator('button[type="submit"]').click();
    
    // Wait for chapter creation
    await page.waitForTimeout(1000);
    
    // Click on the chapter
    await page.locator(`text=${chapterTitle}`).click();
    
    // Export chapter
    await page.locator('text=Export').click();
    
    // Should see export options
    await expect(page.locator('text=Export as PDF')).toBeVisible();
    await expect(page.locator('text=Export as DOCX')).toBeVisible();
    await expect(page.locator('text=Export as TXT')).toBeVisible();
    
    // Test PDF export
    const downloadPromise = page.waitForEvent('download');
    await page.locator('text=Export as PDF').click();
    const download = await downloadPromise;
    
    // Verify download
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
