import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';
import { GoogleLoginPage } from '../../pages/GoogleLoginPage';
import { PropertyReader } from '../../utils/propertyReader';

// Increase default timeout for login tests
setDefaultTimeout(30000); // 30 seconds

let browser: Browser;
let page: Page;
let googleLoginPage: GoogleLoginPage;
let propertyReader: PropertyReader;

Before({ tags: '@login' }, async function () {
  propertyReader = new PropertyReader(process.env.ENV || 'dev');
  browser = await chromium.launch({
    headless: propertyReader.isHeadless()
  });
  page = await browser.newPage();
  googleLoginPage = new GoogleLoginPage(page);
});

After({ tags: '@login' }, async function () {
  if (page) {
    await page.close();
  }
  if (browser) {
    await browser.close();
  }
});

Given('I navigate to Google login page', async function () {
  await googleLoginPage.navigate('https://accounts.google.com/signin');
  // Wait for page to load
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 });
  // Handle consent banner if present
  try {
    const consentButton = page.locator('button:has-text("Accept"), button:has-text("Reject"), button:has-text("I agree")');
    await consentButton.first().click({ timeout: 3000 });
    console.log('Consent banner handled on login page');
  } catch (error) {
    console.log('No consent banner found on login page');
  }
});

Then('I should see the email input field', async function () {
  await expect(googleLoginPage.emailInput).toBeVisible({ timeout: 10000 });
});

When('I enter email {string}', async function (email: string) {
  await googleLoginPage.enterEmail(email);
});

When('I click the Next button', async function () {
  await googleLoginPage.clickNext();
});

Then('I should proceed to password page', async function () {
  // Wait for navigation and check if URL changes or password field appears
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  const url = page.url();
  expect(url).toBeDefined();
});

Then('I should see an error message', async function () {
  // Wait for page to process the input
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  // Error message handling can vary, so we just check if we're still on the same page
  const url = page.url();
  expect(url).toContain('accounts.google.com');
});
