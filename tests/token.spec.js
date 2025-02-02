// const { test, expect } = require(`@playwright/test`);

// const API_ENDPOINT = `/api/complain`;
// const LOADING_MESSAGE = `Loading complaints...`;
// const ERROR_MESSAGE = `An error occurred while fetching complaints.`;
// const NO_COMPLAINTS_MESSAGE = `No complaints found.`;
// const SEARCH_PLACEHOLDER = `input[placeholder="Search by teacher name..."]`;

// test.describe(`AdminComplaintsPage Component Tests`, () => {
//   test.beforeEach(async ({ page }) => {

//     await page.context().addLo([
//       {
//         name: 'token', // Ensure this matches your cookie name
//         value: process.env.JWT_TOKEN,
//         domain: 'localhost', // Adjust if your app uses a different domain
//         path: '/',
//         httpOnly: true,
//         secure: false,
//       },
//     ]);

//     await page.goto(`/admin/complain`);
//   });

//   test.afterEach(async ({ page }) => {
//     await page.unroute(API_ENDPOINT);
//   });

//   test.describe(`API Data Fetching`, () => {
//     test(`Displays loading message while fetching data`, async ({ page }) => {
//       await expect(page.locator(`text=${LOADING_MESSAGE}`)).toBeVisible();
//     });

//     test(`Displays error message when data fetch fails`, async ({ page }) => {
//       await page.route(API_ENDPOINT, route => {
//         route.fulfill({
//           status: 500,
//           contentType: `application/json`,
//           body: JSON.stringify({ message: `Internal server error` }),
//         });
//       });

//       await page.reload();

//       await expect(page.locator(`text=${ERROR_MESSAGE}`)).toBeVisible();
//     });

//     test(`Displays complaints after successful fetch`, async ({ page }) => {
//       await page.route(API_ENDPOINT, route => {
//         route.fulfill({
//           status: 200,
//           contentType: `application/json`,
//           body: JSON.stringify({
//             complaints: [
//               { _id: `1`, teacherName: `John Doe`, date: `2024-03-20T12:00:00Z`, complain: `Test complaint 1`, reply: `Waiting For Reply......`},
//               {  _id: `2`, teacherName: `Jane Smith`, date: `2024-03-21T12:00:00Z`, complain: `Test complaint 2`, reply: `Existing reply`}
//             ]
//           }),
//         });
//       });

//       await page.reload();

//       await expect(page.locator(`text=John Doe`)).toBeVisible();
//       await expect(page.locator(`text=Jane Smith`)).toBeVisible();
//     });
//   });
// });
