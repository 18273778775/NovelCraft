import { test, expect } from '@playwright/test';

test.describe('基础功能测试', () => {
  test('应该显示登录页面', async ({ page }) => {
    await page.goto('/');
    
    // 检查页面标题
    await expect(page).toHaveTitle(/Novel Craft/);
    
    // 检查登录表单元素
    await expect(page.locator('h2')).toContainText('登录账户');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=立即注册')).toBeVisible();
  });

  test('应该能够导航到注册页面', async ({ page }) => {
    await page.goto('/');
    
    // 点击注册链接
    await page.locator('text=立即注册').click();
    
    // 应该导航到注册页面
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('h2')).toContainText('创建账户');
  });

  test('应该显示表单验证错误', async ({ page }) => {
    await page.goto('/');
    
    // 尝试提交空表单
    await page.locator('button[type="submit"]').click();
    
    // 应该显示验证错误
    await expect(page.locator('text=请输入有效的邮箱地址')).toBeVisible();
    await expect(page.locator('text=密码至少6位')).toBeVisible();
  });

  test('应该能够注册新用户', async ({ page }) => {
    await page.goto('/register');
    
    // 填写注册表单
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    
    // 提交表单
    await page.locator('button[type="submit"]').click();
    
    // 应该成功注册并跳转
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.locator('text=项目')).toBeVisible();
  });

  test('应该能够登录', async ({ page }) => {
    // 先注册一个用户
    await page.goto('/register');
    
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    // 等待注册完成
    await page.waitForTimeout(2000);
    
    // 导航到登录页面
    await page.goto('/login');
    
    // 登录
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    // 应该成功登录
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.locator('text=项目')).toBeVisible();
  });

  test('应该能够创建项目', async ({ page }) => {
    // 先登录
    await page.goto('/register');
    
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(2000);
    
    // 创建项目
    await page.locator('text=创建新项目').click();
    
    const projectTitle = `测试项目 ${timestamp}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('这是一个测试项目');
    await page.locator('button[type="submit"]').click();
    
    // 应该看到新项目
    await expect(page.locator(`text=${projectTitle}`)).toBeVisible();
  });

  test('应该能够创建章节', async ({ page }) => {
    // 先登录并创建项目
    await page.goto('/register');
    
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(2000);
    
    // 创建项目
    await page.locator('text=创建新项目').click();
    const projectTitle = `测试项目 ${timestamp}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('这是一个测试项目');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    // 进入项目
    await page.locator(`text=${projectTitle}`).click();
    
    // 创建章节
    await page.locator('text=添加章节').click();
    
    const chapterTitle = `测试章节 ${timestamp}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('这是测试章节的内容，用于测试AI润色功能。');
    await page.locator('button[type="submit"]').click();
    
    // 应该看到新章节
    await expect(page.locator(`text=${chapterTitle}`)).toBeVisible();
  });

  test('应该能够访问AI功能', async ({ page }) => {
    // 先登录、创建项目和章节
    await page.goto('/register');
    
    const timestamp = Date.now();
    const username = `testuser${timestamp}`;
    const email = `test${timestamp}@example.com`;
    const password = 'password123';
    
    await page.locator('input[name="username"]').fill(username);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('input[name="confirmPassword"]').fill(password);
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(2000);
    
    // 创建项目
    await page.locator('text=创建新项目').click();
    const projectTitle = `测试项目 ${timestamp}`;
    await page.locator('input[name="title"]').fill(projectTitle);
    await page.locator('textarea[name="description"]').fill('这是一个测试项目');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    // 进入项目
    await page.locator(`text=${projectTitle}`).click();
    
    // 创建章节
    await page.locator('text=添加章节').click();
    const chapterTitle = `测试章节 ${timestamp}`;
    await page.locator('input[name="title"]').fill(chapterTitle);
    await page.locator('textarea[name="content"]').fill('这是测试章节的内容，用于测试AI润色功能。');
    await page.locator('button[type="submit"]').click();
    
    await page.waitForTimeout(1000);
    
    // 进入章节编辑
    await page.locator(`text=${chapterTitle}`).click();
    
    // 检查AI功能按钮是否存在
    await expect(page.locator('text=AI润色')).toBeVisible();
    await expect(page.locator('text=AI改写')).toBeVisible();
  });

  test('应该响应式设计正常工作', async ({ page }) => {
    // 测试桌面视图
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // 测试移动视图
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // 测试平板视图
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
