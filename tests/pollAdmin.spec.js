const { test, expect } = require(`@playwright/test`);

const API_ENDPOINT = `/api/poll`;
const LOADING_MESSAGE = `Loading Polls...`;
const ERROR_MESSAGE = `An error occurred while fetching the polls.`;
const NO_POLLS_MESSAGE = `No polls available.`;
const POLL_TITLE_INPUT = `input#title`;
const POLL_DESCRIPTION_INPUT = `textarea#description`;
const POLL_DATE_INPUT = `input#lastDate`;
const POLL_STATUS_SELECT = `select#status`;
const POLL_SUBMIT_BUTTON = `button[type="submit"]`;

test.describe(`CreatePoll Component Tests`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/admin/poll`);
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(API_ENDPOINT);
  });

  test.describe(`API Data Fetching`, () => {
    test(`Displays loading message while fetching polls`, async ({ page }) => {
      await expect(page.locator(`text=${LOADING_MESSAGE}`)).toBeVisible();
    });

    test(`Displays error message when data fetch fails`, async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 500,
          contentType: `application/json`,
          body: JSON.stringify({ message: `Internal server error` }),
        });
      });

      await page.reload();

      await expect(page.locator(`text=${ERROR_MESSAGE}`)).toBeVisible();
    });

    test(`Displays polls after successful fetch`, async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 200,
          contentType: `application/json`,
          body: JSON.stringify({
            polls: [
              { _id: `1`, title: `Annual Meeting Poll`, description: `Vote for the best date`, lastDate: `2025-12-31`,createDate: `2025-11-31`, status: `open` },
              { _id: `2`, title: `Workshop Poll`, description: `Choose a workshop topic`, lastDate: `2025-11-30`,createDate: `2025-11-31`, status: `closed` },
            ],
          }),
        });
      });

      await page.reload();

      await expect(page.locator(`text=Annual Meeting Poll`)).toBeVisible();
      await expect(page.locator(`text=Workshop Poll`)).toBeVisible();
    });

    test(`Shows "No polls available" if there are no polls`, async ({ page }) => {
      await page.route(API_ENDPOINT, route => {
        route.fulfill({
          status: 200,
          contentType: `application/json`,
          body: JSON.stringify({ polls: [] }),
        });
      });

      await page.reload();

      await expect(page.locator(`text=${NO_POLLS_MESSAGE}`)).toBeVisible();
    });
  });

  test.describe(`Poll Creation`, () => {
    test(`Creates a new poll successfully`, async ({ page }) => {
  
      // Fill the poll form
      await page.fill(POLL_TITLE_INPUT, `Test Poll`);
      await page.fill(POLL_DESCRIPTION_INPUT, `This is a test poll.`);
      await page.fill(POLL_DATE_INPUT, `2026-12-31`);
      await page.selectOption(POLL_STATUS_SELECT, `open`);
  
      // Click submit button
      await page.click(POLL_SUBMIT_BUTTON);
  
      // await page.reload();

      // // Wait for the poll to appear in the list
      // await page.waitForSelector(`.admin-poll-items`);
    });
  });
});
