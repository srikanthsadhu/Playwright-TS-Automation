# Playwright TypeScript Automation Framework

This is a comprehensive test automation framework built with Playwright, TypeScript, and Cucumber BDD. It supports UI, API, and Accessibility testing.

## Features

- **UI Testing**: Page Object Model (POM) pattern for maintainable UI tests
- **API Testing**: REST API testing using Axios
- **Accessibility Testing**: WCAG compliance checks using @axe-core/playwright
- **BDD with Cucumber**: Behavior-driven development with Gherkin syntax
- **TypeScript**: Strong typing for better code quality
- **Property-based Configuration**: Environment-specific configurations
- **HTML Reports**: Cucumber HTML reports with detailed test results

## Project Structure

```
.
├── config/                          # Environment configurations
│   ├── dev.properties              # Development environment
│   └── qa.properties               # QA environment
├── src/
│   ├── features/                   # Cucumber feature files
│   │   ├── ui/                     # UI test scenarios
│   │   ├── api/                    # API test scenarios
│   │   └── accessibility/          # Accessibility test scenarios
│   ├── steps/                      # Step definitions
│   │   ├── ui/                     # UI step definitions
│   │   ├── api/                    # API step definitions
│   │   └── accessibility/          # Accessibility step definitions
│   ├── pages/                      # Page Object Models
│   └── utils/                      # Utility functions
│       ├── propertyReader.ts       # Configuration reader
│       └── reportGenerator.ts      # HTML report generator
├── reports/                        # Test reports (generated)
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
└── cucumber.js                     # Cucumber configuration

```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Playwright-TS-Automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Configuration

The framework supports multiple environments through property files in the `config/` directory:

- `dev.properties`: Development environment settings
- `qa.properties`: QA environment settings

To use a specific environment, set the `ENV` environment variable:
```bash
export ENV=qa  # Use QA environment
export ENV=dev # Use DEV environment (default)
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run UI tests only:
```bash
npm run test:ui
```

### Run API tests only:
```bash
npm run test:api
```

### Run Accessibility tests only:
```bash
npm run test:accessibility
```

### Generate HTML report:
```bash
npm run report
```

## Test Scenarios

### UI Tests
- Google Home Page tests (logo visibility, search functionality)
- Google Login Page tests (email validation, navigation)

### API Tests
- GET requests (fetch users, fetch single user)
- POST requests (create user)
- PUT requests (update user)
- DELETE requests (delete user)

### Accessibility Tests
- WCAG 2.1 Level AA compliance
- Critical accessibility violation checks

## Writing New Tests

### 1. Create a Feature File
Create a new `.feature` file in the appropriate directory under `src/features/`:

```gherkin
@ui
Feature: My New Feature
  Scenario: My test scenario
    Given I navigate to the page
    When I perform an action
    Then I should see the result
```

### 2. Implement Step Definitions
Create corresponding step definitions in `src/steps/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';

Given('I navigate to the page', async function () {
  // Implementation
});

When('I perform an action', async function () {
  // Implementation
});

Then('I should see the result', async function () {
  // Implementation
});
```

### 3. Create Page Objects (for UI tests)
Create page objects in `src/pages/`:

```typescript
import { Page, Locator } from '@playwright/test';

export class MyPage {
  readonly page: Page;
  readonly myElement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myElement = page.locator('#my-element');
  }

  async performAction(): Promise<void> {
    await this.myElement.click();
  }
}
```

## Reports

After test execution, reports are generated in the `reports/` directory:
- `cucumber-report.json`: JSON report
- `cucumber-report.html`: Basic HTML report
- `cucumber-html-report.html`: Enhanced HTML report (generated via `npm run report`)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for your changes
4. Ensure all tests pass
5. Submit a pull request

## License

ISC
