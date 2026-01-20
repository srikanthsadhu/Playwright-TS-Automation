module.exports = {
  default: {
    require: ['src/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['json:reports/cucumber-report.json', 'html:reports/cucumber-report.html', 'progress'],
    paths: ['src/features/**/*.feature'],
    publishQuiet: true
  }
};
