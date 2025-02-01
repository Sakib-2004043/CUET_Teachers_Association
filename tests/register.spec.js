const { test, expect } = require('@playwright/test');

test.describe('Registration Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page before each test
    await page.goto('/register');
  });

  test('Page loads correctly', async ({ page }) => {
    // Verify the title and key elements
    await expect(page.getByRole('heading', { name: 'Welcome to CUET Teacher\'s Association' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Complete Your Registration' })).toBeVisible();
    await expect(page.getByPlaceholder('Name')).toBeVisible();
    await expect(page.getByPlaceholder('Your E-Mail')).toBeVisible();
    await expect(page.getByPlaceholder('Your Department')).toBeVisible();
    await expect(page.getByPlaceholder('Phone Number')).toBeVisible();
    await expect(page.getByPlaceholder('Set Password')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
  });

  test('Successful registration redirects to /login', async ({ page }) => {
    // Mock API response for successful registration
    await page.route('/api/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ message: "Registration successful! Redirecting to login..." }),
      });
    });

    // Fill the form
    await page.getByPlaceholder('Name').fill('John Doe');
    await page.getByPlaceholder('Your E-Mail').fill('john.doe@example.com');
    await page.getByPlaceholder('Your Department').fill('Computer Science');
    await page.getByPlaceholder('Phone Number').fill('1234567890');
    await page.getByPlaceholder('Set Password').fill('password123');
    await page.getByPlaceholder('Confirm Password').fill('password123');

    // Upload a test image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByPlaceholder('Profile Image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/image.jpg');

    // Submit the form
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Verify navigation to /login
    await expect(page).toHaveURL('/login');
  });

  test('Failed registration shows error message', async ({ page }) => {
    // Mock API response for failed registration
    await page.route('/api/register', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Failed to register. Please try again.' }),
      });
    });

    // Fill the form
    await page.getByPlaceholder('Name').fill('John Doe');
    await page.getByPlaceholder('Your E-Mail').fill('john.doe@example.com');
    await page.getByPlaceholder('Your Department').fill('Computer Science');
    await page.getByPlaceholder('Phone Number').fill('1234567890');
    await page.getByPlaceholder('Set Password').fill('password123');
    await page.getByPlaceholder('Confirm Password').fill('password123');

    // Upload a test image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByPlaceholder('Profile Image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/image.jpg');

    // Submit the form
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Verify error message
    await expect(page.getByText('Failed to register. Please try again.')).toBeVisible();
  });

  test('Empty form submission shows validation errors', async ({ page }) => {
    // Submit the form without filling any fields
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Verify validation messages
    await expect(page.getByPlaceholder('Name')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('Your E-Mail')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('Your Department')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('Phone Number')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('Set Password')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('Confirm Password')).toHaveAttribute('required', '');
    await expect(page.getByPlaceholder('Profile Image')).toHaveAttribute('required', '');
  });

  test('Image upload shows preview', async ({ page }) => {
    // Upload a test image
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByPlaceholder('Profile Image').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/image.jpg');

    // Verify image preview is displayed
    await expect(page.locator('.sign-up-image-preview')).toBeVisible();
  });

  test('Login link redirects to /login', async ({ page }) => {
    // Click the "Login here" link
    await page.getByRole('link', { name: 'Login here' }).click();

    // Verify navigation to /login
    await expect(page).toHaveURL('/login');
  });
});