import { When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';
import { expect } from '@playwright/test';
import { PropertyReader } from '../../utils/propertyReader';
import { GoogleHomePage } from '../../pages/GoogleHomePage';

let browser: Browser;
let page: Page;
let propertyReader: PropertyReader;
let googleHomePage: GoogleHomePage;
let violations: any[] = [];

Before({ tags: '@accessibility' }, async function () {
  propertyReader = new PropertyReader(process.env.ENV || 'dev');
  browser = await chromium.launch({
    headless: propertyReader.isHeadless()
  });
  page = await browser.newPage();
  googleHomePage = new GoogleHomePage(page);

  // Navigate to Google home page automatically
  await googleHomePage.navigate(propertyReader.getBaseUrl());
  await googleHomePage.waitForSearchBox();
});

After({ tags: '@accessibility' }, async function () {
  if (page) {
    await page.close();
  }
  if (browser) {
    await browser.close();
  }
});

When('I run accessibility tests', async function () {
  await injectAxe(page);
  try {
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true
      }
    });
  } catch (error) {
    violations = await getViolations(page);
  }
});

When('I run WCAG 2.1 Level AA accessibility tests', async function () {
  await injectAxe(page);
  try {
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      },
      detailedReport: true
    });
  } catch (error) {
    violations = await getViolations(page);
  }
});

Then('there should be no critical accessibility violations', function () {
  const criticalViolations = violations.filter(v => v.impact === 'critical');
  expect(criticalViolations.length).toBe(0);
});

Then('the page should comply with accessibility standards', function () {
  // Allow minor violations but no critical or serious ones
  const seriousViolations = violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );
  expect(seriousViolations.length).toBe(0);
});
