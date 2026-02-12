import reporter from 'cucumber-html-reporter';
import path from 'path';
import fs from 'fs';

const reportsDir = path.resolve(__dirname, '../../reports');
const outputFile = path.resolve(reportsDir, 'cucumber-enhanced-report.html');
const mergedJsonFile = path.resolve(reportsDir, 'cucumber-report.json');

const getReportFiles = () => {
  if (!fs.existsSync(reportsDir)) {
    return [];
  }

  const files = fs
    .readdirSync(reportsDir)
    .filter(file => file.startsWith('cucumber-report-') && file.endsWith('.json'))
    .map(file => path.resolve(reportsDir, file));

  if (files.length > 0) {
    return files;
  }

  const legacy = path.resolve(reportsDir, 'cucumber-report.json');
  return fs.existsSync(legacy) ? [legacy] : [];
};

const mergeReports = (files: string[]) => {
  const merged: any[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8').trim();
    if (!content) {
      continue;
    }

    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      merged.push(...data);
    }
  }

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(mergedJsonFile, JSON.stringify(merged, null, 2));
};

const reportFiles = getReportFiles();

// Check if JSON report exists
if (reportFiles.length === 0) {
  console.log('⚠️  No test results found. Run tests first.');
  process.exit(1);
}

// Merge report files for parallel execution
mergeReports(reportFiles);

// Delete old enhanced report
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}

const options: any = {
  theme: 'bootstrap',
  jsonFile: mergedJsonFile,
  output: outputFile,
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': process.env.ENV || 'dev',
    'Browser': 'Chromium (Playwright)',
    'Platform': process.platform,
    'Node Version': process.version,
    'Test Run Started': new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    })
  },
  brandTitle: 'Playwright Automation Test Report',
  name: 'Cucumber Test Results'
};

// Generate HTML report
try {
  reporter.generate(options);
  console.log('✅ Enhanced HTML report generated successfully!');
  console.log(`📊 Report: ${outputFile}`);
} catch (error) {
  console.error('❌ Error generating HTML report:', error);
  process.exit(1);
}
