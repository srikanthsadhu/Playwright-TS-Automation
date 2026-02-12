import { Page, Locator } from '@playwright/test';

export class GoogleLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly consentAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.nextButton = page.locator('#identifierNext');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.locator('#passwordNext');
    this.errorMessage = page.locator('[role="alert"]');
    this.consentAcceptButton = page.locator('button:has-text("Accept all"), button:has-text("accept all"), button[aria-label*="Accept"], #L2AGLb');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.handleConsentBanner();
    // Wait for email input to be visible
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async handleConsentBanner(): Promise<void> {
    try {
      // Wait for the consent button with a shorter timeout
      await this.consentAcceptButton.first().waitFor({ state: 'visible', timeout: 3000 });
      await this.consentAcceptButton.first().click();
      console.log('Consent banner accepted successfully on login page');
      await this.page.waitForTimeout(1000);
    } catch (error) {
      // Consent banner might not appear, continue with test
      console.log('No consent banner detected on login page');
    }
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.emailInput.fill(email);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.nextButton.click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}
