import { Page, Locator } from '@playwright/test';

export class GoogleHomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly luckyButton: Locator;
  readonly googleLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('textarea[name="q"]');
    this.searchButton = page.locator('input[name="btnK"]').first();
    this.luckyButton = page.locator('input[name="btnI"]').first();
    this.googleLogo = page.locator('img[alt*="Google"]');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
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
