import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';
import { GoogleHomePage } from '../../pages/GoogleHomePage';
import { PropertyReader } from '../../utils/propertyReader';

let browser: Browser;
let page: Page;
let googleHomePage: GoogleHomePage;
let propertyReader: PropertyReader;

Before({ tags: '@ui and not @login' }, async function () {
  propertyReader = new PropertyReader(process.env.ENV || 'dev');
  browser = await chromium.launch({
    headless: propertyReader.isHeadless()
  });
  page = await browser.newPage();
  googleHomePage = new GoogleHomePage(page);
});

After({ tags: '@ui and not @login' }, async function () {
  if (page) {
    await page.close();
  }
  if (browser) {
    await browser.close();
  }
});

Given('I navigate to Google home page', async function () {
  await googleHomePage.navigate(propertyReader.getBaseUrl());
  await googleHomePage.waitForSearchBox();
});

Then('I should see the Google logo', async function () {
  await expect(googleHomePage.googleLogo).toBeVisible({ timeout: 10000 });
});

Then('the page title should be {string}', async function (expectedTitle: string) {
  const actualTitle = await googleHomePage.getPageTitle();
  expect(actualTitle).toBe(expectedTitle);
});

When('I search for {string}', async function (query: string) {
  await googleHomePage.search(query);
});

Then('I should see search results', async function () {
  // Wait for search results to load
  await page.waitForLoadState('networkidle');
  const url = page.url();
  expect(url).toContain('search');
});
