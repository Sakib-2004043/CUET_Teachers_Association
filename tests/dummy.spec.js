// tests/profile.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Profile Component Tests', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    // Create context with localStorage enabled
    context = await browser.newContext();
    page = await context.newPage();

    // Set mock token in localStorage
    await page.goto('http://localhost:3000/teacher/profile');
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-token');
    });
  });

  test.beforeEach(async () => {
    // Mock API responses
    await page.route('/api/profile', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Member',
          department: 'Computer Science',
          mobile: '123-456-7890',
          profileImage: null
        })
      });
    });

    await page.route('/api/complain', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            complaints: [
              {
                date: new Date().toISOString(),
                complain: 'Test complaint 1',
                reply: 'Test reply 1'
              },
              {
                date: new Date(Date.now() - 86400000).toISOString(),
                complain: 'Test complaint 2',
                reply: null
              }
            ]
          })
        });
      }
    });

    await page.goto('http://localhost:3000/teacher/profile');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should render profile page correctly', async () => {
    // Verify main elements
    await expect(page.getByRole('heading', { name: 'Teacher Profile' })).toBeVisible();
    await expect(page.getByText('Go To Home')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Profile' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your complaint here...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Complaint' })).toBeVisible();
  });

  test('should display user profile information correctly', async () => {
    // Verify profile details
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('john@example.com')).toBeVisible();
    await expect(page.getByText('Professor')).toBeVisible();
    await expect(page.getByText('Computer Science')).toBeVisible();
    await expect(page.getByText('123-456-7890')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
  });

  test('should display previous complaints correctly', async () => {
    // Verify complaints section
    await expect(page.getByText('Previous Complaints')).toBeVisible();
    
    // Check complaint items
    const complaints = page.locator('.teacher-profile-complaint-item');
    await expect(complaints).toHaveCount(2);
    
    // Verify first complaint with reply
    await expect(page.getByText('Test complaint 1')).toBeVisible();
    await expect(page.getByText('Test reply 1')).toBeVisible();
    
    // Verify second complaint without reply
    await expect(page.getByText('Test complaint 2')).toBeVisible();
  });

  test('should handle complaint submission', async () => {
    // Mock POST request for complaint submission
    await page.route('/api/complain', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({})
        });
      }
    });

    // Fill and submit complaint
    await page.getByPlaceholder('Enter your complaint here...').fill('New test complaint');
    await page.getByRole('button', { name: 'Submit Complaint' }).click();
    
    // Verify success
    await expect(page.getByText('Complaint submitted successfully!')).toBeVisible();
  });

  test('should show fallback profile image', async () => {
    const profileImage = page.locator('.teacher-profile-img');
    await expect(profileImage).toHaveAttribute('src', /use\.jpg/);
  });

  test('should handle navigation', async () => {
    // Test Edit button
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/teacher\/edit/);
    await page.goBack();

    // Test Home link
    await page.getByRole('link', { name: 'Go To Home' }).click();
    await expect(page).toHaveURL(/\/teacher/);
  });
});