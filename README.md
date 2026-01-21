# Playwright-TS-Automation

Playwright TypeScript + Cucumber automation framework for UI, API, and Accessibility testing

## 📁 Project Structure
Playwright-TS-Automation/
├── config/ # Environment configuration files
│ ├── dev.properties # Development environment settings
│ └── qa.properties # QA environment settings
│
├── reports/ # Test execution reports
│ ├── cucumber-report.html # HTML test report
│ ├── cucumber-report.json # JSON test report
│ └── allure-report/ # Allure report (generated)
│
├── src/ # Source code
│ ├── features/ # Cucumber feature files
│ │ ├── accessibility/
│ │ │ └── google_accessibility.feature
│ │ ├── api/
│ │ │ └── sample_api.feature
│ │ └── ui/
│ │ ├── google_home.feature
│ │ └── google_login.feature
│ │
│ ├── pages/ # Page Object Models (POM)
│ │ ├── GoogleHomePage.ts
│ │ └── GoogleLoginPage.ts
│ │
│ ├── steps/ # Step definitions
│ │ ├── accessibility/
│ │ │ └── accessibility.steps.ts
│ │ ├── api/
│ │ │ └── api.steps.ts
│ │ └── ui/
│ │ ├── googleHome.steps.ts
│ │ └── googleLogin.steps.ts
│ │
│ └── utils/ # Utility functions
│ ├── propertyReader.ts # Config file reader
│ └── reportGenerator.ts # Custom report generator
│
├── cucumber.js # Cucumber configuration
├── tsconfig.json # TypeScript configuration
├── package.json # Dependencies and scripts
└── README.md # Project documentation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test                     # Run all tests with default settings
npm run test:dev            # Run all tests on dev environment
npm run test:qa             # Run all tests on qa environment
````

### Run by Test Type
```bash
npm run test:ui              # Run all UI tests
npm run test:api             # Run all API tests
npm run test:accessibility   # Run all Accessibility tests
```

# By specific tag
```npx cucumber-js --tags "@apiGet"
npx cucumber-js --tags "@ui and not @login"
```

### Run by Environment
```bash
npm run test:dev              # Run tests on dev environment
npm run test:qa               # Run tests on qa environment
```

### Run Single Scenario
```bash
npx cucumber-js --tags "@your_tag"  # Run tests with specific tag
```

## 📊 Reports
View Allure Report
View HTML Report
🏗️ Framework Features
✅ UI Testing with Playwright
✅ API Testing with Axios
✅ Accessibility Testing with Axe-core
✅ BDD with Cucumber
✅ TypeScript for type safety
✅ Page Object Model design pattern
✅ Multiple environment support (dev/qa)
✅ Allure & HTML reports
✅ Screenshot on failure
✅ Tag-based test execution
🔧 Configuration
Environment Files
Edit dev.properties or qa.properties:

Cucumber Configuration
Edit cucumber.js to modify test execution settings.

📝 Writing Tests
Feature File Example
Step Definition Example
Page Object Example
🏷️ Tags
@ui - UI tests
@api - API tests
@accessibility - Accessibility tests
@login - Login-specific tests
Add custom tags as needed
🤝 Contributing
Create a feature branch
Write tests following the existing patterns
Ensure all tests pass
Submit a pull request

Tags
@ui - UI tests
@api - API tests
@accessibility - Accessibility tests
@login - Login-specific tests