import { Page, Locator } from '@playwright/test';

export class GoogleHomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly luckyButton: Locator;
  readonly googleLogo: Locator;
  readonly consentAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('textarea[name="q"]');
    this.searchButton = page.locator('input[name="btnK"]').first();
    this.luckyButton = page.locator('input[name="btnI"]').first();
    this.googleLogo = page.locator('#hplogo, img[alt*="Google"], img[alt="Google"], [role="img"][aria-label*="Google"]').first();
    this.consentAcceptButton = page.locator('button:has-text("Accept all"), button:has-text("accept all"), button[aria-label*="Accept"], #L2AGLb');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
    await this.handleConsentBanner();
    await this.page.waitForTimeout(1000);
  }

  async handleConsentBanner(): Promise<void> {
    try {
      // Wait for the consent button with a shorter timeout
      await this.consentAcceptButton.first().waitFor({ state: 'visible', timeout: 3000 });
      await this.consentAcceptButton.first().click();
      console.log('Consent banner accepted successfully');
    } catch (error) {
      // Consent banner might not appear, continue with test
      console.log('No consent banner detected or already handled');
    }
  }

  async search(query: string): Promise<void> {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
  }

  async isLogoVisible(): Promise<boolean> {
    return await this.googleLogo.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForSearchBox(): Promise<void> {
    await this.searchBox.waitFor({ state: 'visible' });
  }
}
