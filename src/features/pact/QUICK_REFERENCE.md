# PACT Testing Quick Reference

## Quick Commands

### Run All PACT Tests
```bash
npm run test:pact              # Sequential execution
npm run test:pact:parallel     # Parallel execution (4 workers)
```

### Run Specific Operation
```bash
npm run test:pact:get          # Test GET /users
npm run test:pact:create       # Test POST /users
npm run test:pact:update       # Test PUT /users/:id
npm run test:pact:delete       # Test DELETE /users/:id
npm run test:pact:validation   # Test specific user retrieval
```

### Environment-Specific
```bash
npm run test:pact:dev          # Dev environment, sequential
npm run test:pact:parallel:dev # Dev environment, parallel (4 workers)
npm run test:pact:parallel:qa  # QA environment, parallel (4 workers)
```

### Custom Parallel Workers
```bash
PARALLEL=8 npm run test:pact:parallel   # 8 parallel workers
PARALLEL=2 npm run test:pact:parallel   # 2 parallel workers
```

## Tag-Based Filtering

Run tests by tag combination:

```bash
# Run only parallel-safe tests
cucumber-js --tags '@pact and @parallel'

# Run specific operation tests
cucumber-js --tags '@pact-get'
cucumber-js --tags '@pact-create'

# Run contract tests only
cucumber-js --tags '@contract'

# Exclude parallel tests
cucumber-js --tags '@pact and not @parallel'
```

## Reports

```bash
npm run report                 # Generate HTML report
npm run report:open          # Open report in browser
```

Reports are created at: `reports/cucumber-report-*.html`

## Architecture

### Test Instance Isolation
- **Unique Port**: Each test gets ports 9000-9999 (randomly assigned)
- **Unique ID**: UUID generated per test for logging
- **Separate Dirs**: Each test has its own report directory

### Parallel Execution Flow
1. Cucumber spawns N worker processes (default PARALLEL=1)
2. Each worker runs tests independently
3. Each test gets unique port and instance ID
4. Pact providers verify contracts independently
5. Reports aggregated in `reports/cucumber-report.json`

## File Structure

```
src/
  features/pact/
    README.md                      # Full documentation
    QUICK_REFERENCE.md            # This file
    pact_users_api.feature        # Test scenarios
  steps/pact/
    pact.steps.ts                 # Step implementations
  hooks/
    reportHooks.ts                # Global hooks

reports/
  pacts/
    {pid}/
      {instanceId}/
        pact.log                  # Test logs
        *.json                    # Pact contract files
```

## Understanding Pact Reports

### Contract Files
Located in `reports/pacts/{pid}/{instanceId}/`

Each file represents a contract between consumer and provider:
```
UsersApiProvider-PlaywrightConsumer.json
```

### Log Output
```
[PACT] {instanceId}: Pact provider setup at {url}
[PACT] {instanceId}: Provider ready at {url}
[PACT] {instanceId}: Pact verification successful
```

## Parallel Execution Tips

### Best for Parallel
- Independent scenarios
- No shared state
- No file system conflicts
- Tests tagged with `@parallel`

### Sequential Only
- Tests requiring specific order
- Tests tagged with `@pact-validation`
- Tests with dependencies

### Performance Tips
- Use `@parallel` tag for independent tests
- Increase PARALLEL workers if CPU available
- Monitor disk I/O in `reports/pacts/` directory
- Clean old reports with `npm run clean:reports`

## Debugging Failed Tests

1. **Check Logs**
   ```bash
   cat reports/pacts/{pid}/{instanceId}/pact.log
   ```

2. **View Generated Report**
   ```bash
   npm run report:open
   ```

3. **Run Single Test**
   ```bash
   cucumber-js --tags '@pact-get'
   ```

4. **Enable Verbose Output**
   ```bash
   cucumber-js --tags '@pact' --dry-run
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PARALLEL` | 1 | Number of parallel workers |
| `RETRY` | 0 | Number of retry attempts |
| `ENV` | (none) | Environment (dev, qa) |

Usage:
```bash
PARALLEL=4 ENV=dev npm run test:pact:parallel
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Run PACT Tests
  run: npm run test:pact:parallel

- name: Generate Reports
  run: npm run report
  if: always()

- name: Upload Artifacts
  uses: actions/upload-artifact@v2
  with:
    name: pact-reports
    path: reports/
```

### GitLab CI Example
```yaml
test:pact:
  script:
    - npm run test:pact:parallel
    - npm run report
  artifacts:
    paths:
      - reports/
    when: always
```

## Test Matrix

| Operation | Endpoint | Method | Status | Parallel |
|-----------|----------|--------|--------|----------|
| Get Users | /users | GET | 200 | ✓ |
| Get User | /users/:id | GET | 200 | ✗ |
| Create User | /users | POST | 201 | ✓ |
| Update User | /users/:id | PUT | 200 | ✓ |
| Delete User | /users/:id | DELETE | 204 | ✓ |

## Common Issues & Solutions

### Port Conflicts
```bash
# Check port availability
lsof -i :9000-9999

# Use different port range (modify getRandomPort in pact.steps.ts)
```

### Out of Memory
```bash
# Reduce parallel workers
PARALLEL=2 npm run test:pact:parallel

# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run test:pact:parallel
```

### Report Generation Failures
```bash
# Clean old reports
npm run clean:reports

# Regenerate
npm run report
```

## Extending PACT Tests

### Add New Scenario
1. Edit `src/features/pact/pact_users_api.feature`
2. Add scenario with appropriate tags
3. Implement steps in `src/steps/pact/pact.steps.ts`
4. Test with: `npm run test:pact`

### Add New Operation
Example for PATCH operation:
```gherkin
@pact-patch @parallel
Scenario: Patch user returns patched user
  Given a Pact mock provider is running
  And the API will partially update a user
  When I patch a user via the mock API
  Then the Pact patch response should match
```

Then implement corresponding steps for PATCH operation.

## Version Info

- **Cucumber**: ^10.0.0
- **PACT**: ^12.5.2
- **Playwright**: ^1.40.0
- **Node.js**: 14+

## Support & Resources

- [PACT Documentation](https://docs.pact.foundation/)
- [Cucumber.js Docs](https://cucumber.io/docs/cucumber/)
- [Playwright Docs](https://playwright.dev/)

---

**Last Updated**: February 2026
