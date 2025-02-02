const { test, expect } = require('@playwright/test');

test.describe('AllLandingHeader Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the root page where the header is rendered before each test
    await page.goto('/');
  });

  test('Header loads correctly', async ({ page }) => {
    // Check if the CUET Teachers Association logo and title are visible
    await expect(page.locator('img[alt="CUET Teachers Association Logo"]')).toBeVisible();
    await expect(page.locator('h1.root-layout-title')).toHaveText('🎓 CUET Teachers Association 🌟');
  });

  test('Logo redirects to home page when clicked', async ({ page }) => {
    // Click on the CUET logo and verify that the page navigates to the home page ('/')
    await page.locator('img[alt="CUET Teachers Association Logo"]').click();
    await expect(page).toHaveURL('/');
  });

  test('Navigation links are visible and functional', async ({ page }) => {
    // Verify if the About, Contact, and Login links are visible
    await expect(page.locator('a.root-layout-nav-link:has-text("📖 About")')).toBeVisible();
    await expect(page.locator('a.root-layout-nav-link:has-text("📞 Contact")')).toBeVisible();
    await expect(page.locator('a.root-layout-nav-link:has-text("🔑 Login")')).toBeVisible();

    // Test that clicking the Login link redirects to the /login page
    await page.locator('a.root-layout-nav-link:has-text("🔑 Login")').click();
    await expect(page).toHaveURL('/login');
  });

  test('Header styling is applied correctly', async ({ page }) => {
    // Check if the root layout header has the correct styling class
    await expect(page.locator('header.root-layout-header')).toHaveClass(/root-layout-header/);
    await expect(page.locator('.root-layout-header-content')).toHaveClass(/root-layout-header-content/);
  });
  
});
