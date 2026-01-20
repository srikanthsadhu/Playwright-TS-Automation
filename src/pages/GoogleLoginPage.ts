import { Page, Locator } from '@playwright/test';

export class GoogleLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly nextButton: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.nextButton = page.locator('#identifierNext');
    this.passwordInput = page.locator('input[type="password"]');
    this.signInButton = page.locator('#passwordNext');
    this.errorMessage = page.locator('[role="alert"]');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
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
