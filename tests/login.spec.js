const { test, expect } = require('@playwright/test');

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/login');
  });

  test('Page loads correctly', async ({ page }) => {
    // Verify the title and key elements
    await expect(page.getByRole('heading', { name: '🔑 Log In to Your Account' })).toBeVisible();
    await expect(page.getByPlaceholder('📧 Email Address')).toBeVisible();
    await expect(page.getByPlaceholder('🔒 Password')).toBeVisible();
    await expect(page.getByRole('button', { name: '🚀 Log In' })).toBeVisible();
  });

  test('Successful login redirects to /teacher for Members', async ({ page }) => {
    // Mock API response for successful login
    await page.route('/api/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', role: 'Member' }),
      });
    });

    // Fill and submit the form
    await page.getByPlaceholder('📧 Email Address').fill('test@example.com');
    await page.getByPlaceholder('🔒 Password').fill('password123');
    await page.getByRole('button', { name: '🚀 Log In' }).click();

    // Verify navigation to /teacher
    await expect(page).toHaveURL('/teacher');
  });

  test('Successful login redirects to /admin for Admins', async ({ page }) => {
    // Mock API response for successful login
    await page.route('/api/register', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', role: 'Admin' }),
      });
    });

    // Fill and submit the form
    await page.getByPlaceholder('📧 Email Address').fill('admin@example.com');
    await page.getByPlaceholder('🔒 Password').fill('admin123');
    await page.getByRole('button', { name: '🚀 Log In' }).click();

    // Verify navigation to /admin
    await expect(page).toHaveURL('/admin');
  });

  test('Failed login shows error message', async ({ page }) => {
    // Mock API response for failed login
    await page.route('/api/register', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    // Fill and submit the form
    await page.getByPlaceholder('📧 Email Address').fill('wrong@example.com');
    await page.getByPlaceholder('🔒 Password').fill('wrongpassword');
    await page.getByRole('button', { name: '🚀 Log In' }).click();

    // Verify error message
    await expect(page.getByText('⚠️ Failed to log in: Invalid Credentials')).toBeVisible();
  });

  test('Network error shows generic error message', async ({ page }) => {
    // Mock network failure
    await page.route('/api/register', async (route) => {
      await route.abort();
    });

    // Fill and submit the form
    await page.getByPlaceholder('📧 Email Address').fill('test@example.com');
    await page.getByPlaceholder('🔒 Password').fill('password123');
    await page.getByRole('button', { name: '🚀 Log In' }).click();

    // Verify generic error message
    await expect(page.getByText('❌ An error occurred. Please try again.')).toBeVisible();
  });

  test('Empty form submission shows validation errors', async ({ page }) => {
    // Submit the form without filling any fields
    await page.getByRole('button', { name: '🚀 Log In' }).click();

    // Verify validation messages
    await expect(page.getByPlaceholder('📧 Email Address')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('🔒 Password')).toHaveAttribute('required', '');
  });

  test('Register button redirects to /register', async ({ page }) => {
    // Click the "Register Now!" button
    await page.getByRole('button', { name: 'Register Now! 📝' }).click();

    // Verify navigation to /register
    await expect(page).toHaveURL('/register');
  });

  test('Forgot Password button is clickable', async ({ page }) => {
    // Verify the "Forgot Password?" button exists and is clickable
    await expect(page.getByRole('button', { name: 'Forgot Password? 🤔' })).toBeVisible();
    await page.getByRole('button', { name: 'Forgot Password? 🤔' }).click();
  });
});