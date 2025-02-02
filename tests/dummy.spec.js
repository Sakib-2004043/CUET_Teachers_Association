const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

// Test data
const mockProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Member',
  department: 'Mathematics',
  mobile: '123-456-7890',
  profileImage: Buffer.from('fake-image-content').toString('base64')
};

const mockComplaints = [
  {
    date: new Date().toISOString(),
    complain: 'Sample complaint 1',
    reply: 'Sample reply 1'
  },
  {
    date: new Date(Date.now() - 86400000).toISOString(),
    complain: 'Sample complaint 2'
  }
];

test.describe('Teacher Profile Component', () => {
  test.beforeEach(async ({ page }) => {
    // Mock localStorage token
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-token');
    });

    // Setup API mocks
    await page.route('/api/profile', async (route) => {
      const method = route.request().method();
      // Handle GET request for initial profile load
      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProfile),
        });
      }
      // Handle POST request for profile updates
      else if (method === 'POST') {
        const postData = await route.request().postDataJSON();
        // Update mockProfile with new email if provided
        if (postData.email) {
          mockProfile.email = postData.email;
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockProfile),
        });
      }
    });

    await page.route('/api/complain', async (route) => {
      if (route.request().method() === 'PUT') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ complaints: mockComplaints })
        });
      }
    });

    await page.goto('/teacher/profile');
  });

  test('should load and display profile data', async ({ page }) => {
    // Generate test data
    const fakeEmail = faker.internet.email('john.doe', 'gmail.com');

    // Wait for initial profile load
    await page.waitForResponse(
      response =>
        response.url().includes('/api/profile') &&
        response.status() === 200 &&
        response.request().method() === 'GET'
    );

    // Verify initial profile data
    await expect(page.getByText(mockProfile.email)).toBeVisible();
    await expect(page.locator('img[alt="Profile"]')).toBeVisible();

    // Example: Simulate profile update through UI
    // Assuming there's an edit button and email input field
    await page.click('button:has-text("Edit Profile")');
    await page.fill('input[name="email"]', fakeEmail);
    await page.click('button:has-text("Save Changes")');

    // Wait for POST request to complete
    await page.waitForResponse(
      response =>
        response.url().includes('/api/profile') &&
        response.status() === 200 &&
        response.request().method() === 'POST'
    );

    // Verify updated email
    await expect(page.getByText(fakeEmail)).toBeVisible({ timeout: 10000 });

    // Take a screenshot
    await page.screenshot({ path: 'test_results/profile_display.png', fullPage: true });
  });


  // test('should handle complaint submission', async ({ page }) => {
  //   // Mock complaint submission
  //   await page.route('/api/complain', async route => {
  //     if (route.request().method() === 'POST') {
  //       return route.fulfill({
  //         status: 200,
  //         body: JSON.stringify({ success: true })
  //       });
  //     }
  //   });

  //   // Test empty complaint submission
  //   await page.click('button:has-text("Submit Complaint")');
  //   await expect(page.getByText('Please fill in the complaint text.')).toBeVisible();

  //   // Submit valid complaint
  //   const testComplaint = faker.lorem.sentence();
  //   await page.fill('textarea', testComplaint);
  //   await page.click('button:has-text("Submit Complaint")');
    
  //   // Verify complaint list update
  //   await expect(page.locator('.teacher-profile-complaint-item').first()).toContainText(testComplaint);
  // });

  // test('should display previous complaints correctly', async ({ page }) => {
  //   // Verify complaints are sorted by date
  //   const complaintDates = await page.locator('.teacher-profile-complaint-date').allTextContents();
  //   const dates = complaintDates.map(d => new Date(d.split(': ')[1]));
    
  //   for (let i = 0; i < dates.length - 1; i++) {
  //     expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
  //   }

  //   // Verify reply display
  //   await expect(page.locator('.teacher-profile-reply-card').first()).toBeVisible();
  //   await expect(page.getByText('No previous complaints found')).not.toBeVisible();
  // });

  // test('should handle API errors gracefully', async ({ page }) => {
  //   // Mock profile fetch failure
  //   await page.route('/api/profile', route => route.fulfill({ status: 500 }));
  //   await page.reload();
  //   await expect(page.getByText('Loading profile details...')).toBeVisible();

  //   // Mock complaints fetch failure
  //   await page.route('/api/complain', route => route.fulfill({ status: 500 }));
  //   await expect(page.getByText('No previous complaints found')).toBeVisible();
  // });

  // test('should handle navigation', async ({ page }) => {
  //   // Test edit button
  //   await page.click('button:has-text("Edit")');
  //   await expect(page).toHaveURL('/teacher/edit');

  //   // Test home link
  //   await page.goBack();
  //   await page.click('a:has-text("Go To Home")');
  //   await expect(page).toHaveURL('/teacher');
  // });

  // test('should handle unauthorized access', async ({ page }) => {
  //   // Clear authentication token
  //   await page.addInitScript(() => localStorage.removeItem('token'));
  //   await page.reload();
  //   await expect(page).toHaveURL('/login');
  // });

  // test('should display default profile image', async ({ page }) => {
  //   // Mock profile without image
  //   await page.route('/api/profile', route => {
  //     const noImageProfile = { ...mockProfile, profileImage: null };
  //     return route.fulfill({
  //       status: 200,
  //       body: JSON.stringify(noImageProfile)
  //     });
  //   });

  //   await page.reload();
  //   await expect(page.locator('img[alt="Default Profile"]')).toBeVisible();
  // });

  // test('should handle notification setting', async ({ page }) => {
  //   // Verify notification set on successful complaint
  //   await page.route('/api/complain', async route => {
  //     await route.fulfill({ status: 200 });
  //     // Add verification for notification API call here
  //   });

  //   await page.fill('textarea', 'Test complaint');
  //   await page.click('button:has-text("Submit Complaint")');
  //   // Add assertion for notification API call
  // });
});