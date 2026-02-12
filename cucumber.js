module.exports = {
  default: {
    require: ['src/steps/**/*.ts', 'src/hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      `json:reports/cucumber-report-${process.pid}.json`,
      'progress'
    ],
    paths: ['src/features/**/*.feature'],
    parallel: Number(process.env.PARALLEL || 1)
  },
  pact: {
    require: ['src/steps/**/*.ts', 'src/hooks/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      `json:reports/cucumber-report-${process.pid}.json`,
      'progress'
    ],
    paths: ['src/features/pact/**/*.feature'],
    parallel: Number(process.env.PARALLEL || 1),
    strict: true
  }
};
