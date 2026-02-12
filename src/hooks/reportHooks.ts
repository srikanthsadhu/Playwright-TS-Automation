import { AfterAll } from '@cucumber/cucumber';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

AfterAll(async function () {
  const projectRoot = path.resolve(__dirname, '../../');
  const jsonReportPath = path.resolve(projectRoot, 'reports/cucumber-report.json');

  // Poll for JSON report to be written with valid content
  const maxAttempts = 10;
  const delayMs = 500;
  let isReportReady = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, delayMs));

    if (!fs.existsSync(jsonReportPath)) {
      continue;
    }

    try {
      const jsonContent = fs.readFileSync(jsonReportPath, 'utf-8');
      if (jsonContent && jsonContent.trim().length > 10) {
        JSON.parse(jsonContent);
        isReportReady = true;
        break;
      }
    } catch (error) {
      // JSON not ready yet, continue polling
    }
  }

  if (!isReportReady) {
    console.log('⚠️  JSON report not ready after 5 seconds, skipping HTML report generation');
    return;
  }

  // Generate HTML report
  console.log('\n🔄 Generating HTML report...');
  try {
    const reportGeneratorPath = path.resolve(__dirname, '../utils/reportGenerator.ts');
    const tsNodePath = path.resolve(projectRoot, 'node_modules/.bin/ts-node');

    execSync(`"${tsNodePath}" "${reportGeneratorPath}"`, {
      stdio: 'inherit',
      cwd: projectRoot
    });
  } catch (error) {
    console.error('⚠️  HTML report generation failed:', error);
    // Don't fail the test run if report generation fails
  }
});
