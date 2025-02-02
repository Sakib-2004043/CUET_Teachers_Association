const { test, expect } = require('@playwright/test');

const API_ENDPOINT = '/api/profile';
const LOADING_MESSAGE = 'Loading teachers...';
const ERROR_MESSAGE = 'An error occurred while fetching the teachers\' data.';
const NO_TEACHERS_MESSAGE = 'No teachers found.';
const SEARCH_PLACEHOLDER = 'input[placeholder="Search by any field..."]';

test.describe('TeachersList Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/allTeacher');
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(API_ENDPOINT);
  });

  test.describe('API Data Fetching', () => {
    test('Displays loading message while fetching data', async ({ page }) => {
      await expect(page.locator(`text=${LOADING_MESSAGE}`)).toBeVisible();
    });

    test('Displays error message when data fetch fails', async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' }),
        });
      });

      await page.reload();

      await expect(page.locator(`text=${ERROR_MESSAGE}`)).toBeVisible();
    });

    test('Displays teacher data after successful fetch', async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            Data: [
              { _id: '1', name: 'John Doe', email: 'john.doe@example.com', department: 'Math', mobile: '123-456-7890', role: 'Member' },
              { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Science', mobile: '987-654-3210', role: 'Admin' },
            ],
          }),
        });
      });

      await page.reload();

      await expect(page.locator('text=John Doe')).toBeVisible();
      await expect(page.locator('text=Jane Smith')).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('Search functionality filters teachers correctly', async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            Data: [
              { _id: '1', name: 'John Doe', email: 'john.doe@example.com', department: 'Math', mobile: '123-456-7890', role: 'Member' },
              { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Science', mobile: '987-654-3210', role: 'Admin' },
            ],
          }),
        });
      });

      await page.reload();

      await page.locator(SEARCH_PLACEHOLDER).fill('john');

      await expect(page.locator('text=John Doe')).toBeVisible();
      await expect(page.locator('text=Jane Smith')).not.toBeVisible();
    });

    test('Displays message when no teachers match the search query', async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            Data: [
              { _id: '1', name: 'John Doe', email: 'john.doe@example.com', department: 'Math', mobile: '123-456-7890', role: 'Member' },
              { _id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Science', mobile: '987-654-3210', role: 'Admin' },
            ],
          }),
        });
      });

      await page.reload();

      await page.locator(SEARCH_PLACEHOLDER).fill('nonexistent');

      await expect(page.locator(`text=${NO_TEACHERS_MESSAGE}`)).toBeVisible();
    });
  });

  test.describe('Profile Images', () => {
    test('Handles teacher profile images correctly', async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            Data: [
              { _id: '1', name: 'John Doe', profileImage: 'base64-image-string' },
              { _id: '2', name: 'Jane Smith', profileImage: '' },
            ],
          }),
        });
      });

      await page.reload();

      await expect(page.locator('img[alt="John Doe\'s profile"]')).toBeVisible();
      await expect(page.locator('text=No Image')).toBeVisible();
    });
  });
});