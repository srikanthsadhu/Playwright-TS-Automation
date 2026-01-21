module.exports = {
  default: {
    require: ['src/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'progress',
      'allure-cucumberjs/reporter:allure-results' // Add Allure by default
    ],
    publishQuiet: true
  }
};
