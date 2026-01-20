const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

const options = {
  theme: 'bootstrap',
  jsonFile: path.resolve(__dirname, '../../reports/cucumber-report.json'),
  output: path.resolve(__dirname, '../../reports/cucumber-html-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'Test Environment': process.env.ENV || 'DEV',
    'Browser': 'Chromium',
    'Platform': process.platform,
    'Executed': new Date().toISOString()
  }
};

// Create reports directory if it doesn't exist
const reportsDir = path.resolve(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Generate HTML report
try {
  reporter.generate(options);
  console.log('HTML report generated successfully!');
} catch (error) {
  console.error('Error generating HTML report:', error);
}
