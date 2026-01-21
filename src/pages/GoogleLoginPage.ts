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

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
}
