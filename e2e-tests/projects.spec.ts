import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
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
    
    // Wait for login to complete
    await page.waitForTimeout(2000);
  });

  test('should display projects page', async ({ page }) => {
    // Navigate to projects
    await page.locator('text=Projects').click();
    
    // Check if projects page is displayed
    await expect(page.locator('h1')).toContainText('Projects');
    await expect(page.locator('text=Create New Project')).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    // Navigate to projects
    await page.locator('text=Projects').click();
    
    // Click create new project
    await page.locator('text=Create New Project').click();
    
    // Fill project form
    const projectTitle = `Test Project ${Date.now()}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('This is a test project description');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Should see the new project in the list
    await expect(page.locator(`text=${projectTitle}`)).toBeVisible();
  });

  test('should edit project', async ({ page }) => {
    // Navigate to projects and create a project first
    await page.locator('text=Projects').click();
    await page.locator('text=Create New Project').click();
    
    const projectTitle = `Test Project ${Date.now()}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('Original description');
    await page.locator('button[type="submit"]').click();
    
    // Wait for project to be created
    await page.waitForTimeout(1000);
    
    // Edit the project
    await page.locator(`text=${projectTitle}`).click();
    await page.locator('text=Edit').click();
    
    // Update project details
    const updatedTitle = `${projectTitle} - Updated`;
    await page.locator('input[name="title"]').clear();
    await page.locator('input[name="title"]').fill(updatedTitle);
    await page.locator('textarea[name="description"]').clear();
    await page.locator('textarea[name="description"]').fill('Updated description');
    
    // Save changes
    await page.locator('button[type="submit"]').click();
    
    // Should see updated project
    await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();
  });

  test('should delete project', async ({ page }) => {
    // Navigate to projects and create a project first
    await page.locator('text=Projects').click();
    await page.locator('text=Create New Project').click();
    
    const projectTitle = `Test Project ${Date.now()}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('To be deleted');
    await page.locator('button[type="submit"]').click();
    
    // Wait for project to be created
    await page.waitForTimeout(1000);
    
    // Delete the project
    await page.locator(`text=${projectTitle}`).click();
    await page.locator('text=Delete').click();
    
    // Confirm deletion
    await page.locator('text=Confirm').click();
    
    // Project should no longer be visible
    await expect(page.locator(`text=${projectTitle}`)).not.toBeVisible();
  });

  test('should search projects', async ({ page }) => {
    // Navigate to projects and create multiple projects
    await page.locator('text=Projects').click();
    
    const project1 = `Novel Project ${Date.now()}`;
    const project2 = `Story Project ${Date.now()}`;
    
    // Create first project
    await page.locator('text=Create New Project').click();
    await page.locator('input[name="title"]').fill(project1);
    await page.locator('textarea[name="description"]').fill('A novel');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);
    
    // Create second project
    await page.locator('text=Create New Project').click();
    await page.locator('input[name="title"]').fill(project2);
    await page.locator('textarea[name="description"]').fill('A story');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);
    
    // Search for specific project
    await page.locator('input[placeholder="Search projects"]').fill('Novel');
    
    // Should show only the novel project
    await expect(page.locator(`text=${project1}`)).toBeVisible();
    await expect(page.locator(`text=${project2}`)).not.toBeVisible();
  });
});
