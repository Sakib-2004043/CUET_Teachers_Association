const { test, expect } = require('@playwright/test');

test.describe('TeacherPoll Component Tests', () => {
  let page;
  let context;
  
  test.beforeAll(async ({ browser }) => {
    // Create a context with localStorage enabled
    context = await browser.newContext();
    page = await context.newPage();
    
    // Set mock token in localStorage
    await page.goto('/teacher/poll'); // Navigate to domain first
    await page.evaluate(() => {
      localStorage.setItem('token', 'fake-token');
    });
  });

  test.beforeEach(async () => {
    // Mock API responses
    await page.route('/api/poll', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          polls: [
            {
              _id: '1',
              title: 'Test Poll',
              description: 'Test description',
              lastDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
              status: 'open',
              yesVote: [],
              noVote: []
            },
            {
              _id: '2',
              title: 'Closed Poll',
              description: 'Closed description',
              lastDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              status: 'closed',
              yesVote: ['Teacher1'],
              noVote: []
            }
          ]
        })
      });
    });

    await page.goto('/teacher/poll');
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('should render page correctly', async () => {
    await expect(page.getByRole('heading', { name: '🗳️ Ongoing Polls' })).toBeVisible();
    await expect(page.getByText('Participate in the decision-making process.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'All Polls' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Polls' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Closed Polls' })).toBeVisible();
  });

  test('should display open and closed polls', async () => {
    await expect(page.getByText('✅ Voting is Open')).toBeVisible();
    await expect(page.getByText('❌ Voting is Closed')).toBeVisible();
  });

  test('should filter polls correctly', async () => {
    // Test Open Polls filter
    await page.getByRole('button', { name: 'Open Polls' }).click();
    await expect(page.getByText('✅ Voting is Open')).toBeVisible();
    await expect(page.getByText('❌ Voting is Closed')).not.toBeVisible();

    // Test Closed Polls filter
    await page.getByRole('button', { name: 'Closed Polls' }).click();
    await expect(page.getByText('✅ Voting is Open')).not.toBeVisible();
    await expect(page.getByText('❌ Voting is Closed')).toBeVisible();

    // Test All Polls filter
    await page.getByRole('button', { name: 'All Polls' }).click();
    await expect(page.getByText('✅ Voting is Open')).toBeVisible();
    await expect(page.getByText('❌ Voting is Closed')).toBeVisible();
  });

  test('should show countdown timer', async () => {
    const countdown = await page.getByText('⏳ Time Left:').first().textContent();
    expect(countdown).toMatch(/\d+d : \d+h : \d+m : \d+s/);
  });

  test('should handle closed poll state', async () => {
    await page.getByRole('button', { name: 'Closed Polls' }).click();
    await expect(page.getByText('🚫 This poll is closed.')).toBeVisible();
  });

  test('should display no polls message', async () => {
    await page.route('/api/poll', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ polls: [] })
      });
    });

    await page.reload();
    await expect(page.getByText('⚠️ No polls found in this category.')).toBeVisible();
  });
});