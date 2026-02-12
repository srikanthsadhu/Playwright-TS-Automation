# PACT Contract Testing

This directory contains PACT contract tests for validating API contracts between the consumer (Playwright test automation) and the provider (Users API).

## Overview

PACT is a consumer-driven contract testing framework that ensures both API consumers and providers can communicate effectively without waiting for the other to be fully developed.

### Features

- **Contract Validation**: Ensures requests/responses match agreed contracts
- **Isolated Testing**: Tests run in isolated PACT mock providers
- **Parallel Execution**: Multiple scenarios can run in parallel
- **Comprehensive Coverage**: Tests for GET, POST, PUT, and DELETE operations

## Test Structure

### Feature File: `pact_users_api.feature`

The feature file contains the following test scenarios:

#### Parallel Execution Scenarios (Tagged with `@parallel`)

These scenarios can run in parallel with each other:

1. **Get users returns a list of users** (`@pact-get`)
   - Validates GET /users returns a list of valid user objects
   - Expected Status: 200

2. **Create user returns created user** (`@pact-create`)
   - Validates POST /users creates a new user
   - Expected Status: 201

3. **Update user returns updated user** (`@pact-update`)
   - Validates PUT /users/{id} updates an existing user
   - Expected Status: 200

4. **Delete user returns no content** (`@pact-delete`)
   - Validates DELETE /users/{id} removes a user
   - Expected Status: 204

#### Sequential Scenario (Tagged with `@pact-validation`)

5. **Get user by ID returns specific user** (`@pact-validation`)
   - Validates GET /users/{id} returns a specific user
   - Expected Status: 200
   - Runs independently

## Tag Structure

```
@pact              - All PACT tests
@api               - API testing category
@contract          - Contract validation tests
@parallel          - Can run in parallel
@pact-get          - GET operation tests
@pact-create       - CREATE operation tests
@pact-update       - UPDATE operation tests
@pact-delete       - DELETE operation tests
@pact-validation   - Validation-specific tests
```

## Running PACT Tests

### Run All PACT Tests (Sequential)
```bash
npm run test:pact
```

### Run PACT Tests in Parallel (4 processes)
```bash
npm run test:pact:parallel
```

### Run Specific Operation Tests

Get all users:
```bash
npm run test:pact:get
```

Create user:
```bash
npm run test:pact:create
```

Update user:
```bash
npm run test:pact:update
```

Delete user:
```bash
npm run test:pact:delete
```

Validation tests:
```bash
npm run test:pact:validation
```

### Environment-Specific Testing

Development environment:
```bash
npm run test:pact:dev
```

QA environment:
```bash
npm run test:pact:parallel:dev
npm run test:pact:parallel:qa
```

## Parallel Execution Details

### How It Works

1. **Unique Port Allocation**: Each test instance gets a unique port (9000-9999) to avoid conflicts
2. **Unique Instance ID**: Each test has a unique identifier for logging and isolation
3. **Separate Pact Files**: Each test creates its own Pact file in `reports/pacts/{pid}/{instanceId}/`
4. **Independent Providers**: Each test runs its own isolated PACT mock provider

### Configuration

Parallel execution is controlled via the `PARALLEL` environment variable:

```bash
PARALLEL=4 npm run test:pact:parallel  # Run 4 parallel workers
PARALLEL=8 npm run test:pact:parallel  # Run 8 parallel workers
```

Default is 1 (sequential).

## Step Definitions

All step definitions are located in `src/steps/pact/pact.steps.ts`

### Given Steps
- `Given a Pact mock provider is running`
- `Given the API will return a list of users`
- `Given the API will return a user by ID`
- `Given the API will create a user`
- `Given the API will update a user`
- `Given the API will delete a user`

### When Steps
- `When I request users from the mock API`
- `When I request user with ID 1 from the mock API`
- `When I create a user via the mock API`
- `When I update a user via the mock API`
- `When I delete a user via the mock API`

### Then Steps
- `Then the Pact response should match`
- `Then the response contains valid user objects`
- `Then the response user has ID 1`
- `Then the Pact create response should match`
- `Then the response contains the created user data`
- `Then the Pact update response should match`
- `Then the response contains the updated user data`
- `Then the Pact delete response should match`

## Hook Implementation

### Before Hook (`@pact`)
- Initializes a unique PACT provider instance
- Allocates a random port (9000-9999)
- Sets up logging directory
- Logs provider setup details

### After Hook (`@pact`)
- Verifies all contract interactions
- Finalizes the PACT provider
- Cleans up resources
- Logs verification status

## Response Data Structure

### User Object
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Expected Status Codes
- **GET**: 200 OK
- **POST**: 201 Created
- **PUT**: 200 OK
- **DELETE**: 204 No Content

## Reports and Logging

### Report Generation
```bash
npm run report              # Generate HTML report
npm run report:open        # Open latest report in browser
```

### Pact Files Location
```
reports/pacts/{pid}/{instanceId}/
  ├── pact.log
  └── *.json (Pact contract files)
```

### Logging

Each test logs with a unique instance ID:
```
[PACT] a1b2c3d4e5f6g7h8: Pact provider setup at http://localhost:9234
[PACT] a1b2c3d4e5f6g7h8: Provider ready at http://localhost:9234
[PACT] a1b2c3d4e5f6g7h8: Pact verification successful
```

## Troubleshooting

### Port Already in Use
- The random port allocation (9000-9999) should prevent conflicts
- Ensure no other processes are using the same port range

### Pact Verification Failures
- Check that requests/responses match the defined interactions
- Review `reports/pacts/{pid}/{instanceId}/pact.log` for details

### Parallel Execution Issues
- Reduce `PARALLEL` value if experiencing resource constraints
- Check disk space for report generation

## Best Practices

1. **Use Unique Tags**: Each scenario has specific tags for targeted execution
2. **Parallel Safe**: Scenarios tagged with `@parallel` can safely run concurrently
3. **Port Management**: Random port allocation prevents conflicts
4. **Logging**: Each test instance has unique logging for easy debugging
5. **Report Generation**: Always generate reports after test runs

## Integration with CI/CD

Example for GitHub Actions:

```yaml
- name: Run PACT tests in parallel
  run: npm run test:pact:parallel

- name: Generate reports
  run: npm run report

- name: Upload reports
  uses: actions/upload-artifact@v2
  with:
    name: pact-reports
    path: reports/
```

## Extending the Tests

To add new PACT scenarios:

1. Add scenario to `pact_users_api.feature`
2. Add corresponding step definitions to `pact.steps.ts`
3. Use appropriate tags for parallel/sequential execution
4. Update this README with new test details

## References

- [PACT Documentation](https://docs.pact.foundation/)
- [PACT-Foundation NPM](https://www.npmjs.com/package/@pact-foundation/pact)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
