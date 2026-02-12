# PACT Testing Architecture & Execution Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│         Playwright Test Automation Framework            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │     UI       │  │     API      │  │ Accessibility│   │
│  │   Tests      │  │    Tests     │  │    Tests     │   │
│  │  (@ui)       │  │  (@api)      │  │  (@access...)│   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │      PACT Contract Testing (@pact)              │    │
│  │                                                  │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │     Feature: pact_users_api.feature       │   │    │
│  │  │  • Get Users (@pact-get @parallel)       │   │    │
│  │  │  • Create User (@pact-create @parallel)  │   │    │
│  │  │  • Update User (@pact-update @parallel)  │   │    │
│  │  │  • Delete User (@pact-delete @parallel)  │   │    │
│  │  │  • Get User by ID (@pact-validation)     │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  │                                                  │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │    pact.steps.ts - Step Definitions       │   │    │
│  │  │  • 6 Given steps                          │   │    │
│  │  │  • 5 When steps                           │   │    │
│  │  │  • 8 Then steps                           │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  │                                                  │    │
│  │  ┌──────────────────────────────────────────┐   │    │
│  │  │  Hooks (Before/After)                     │   │    │
│  │  │  • Initialize PACT provider per test      │   │    │
│  │  │  • Allocate unique port (9000-9999)      │   │    │
│  │  │  • Generate unique instance ID            │   │    │
│  │  └──────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────────────────────┐
        │   Cucumber.js Test Runner         │
        │  (Parallel Execution Support)     │
        └──────────────────────────────────┘
```

## Parallel Execution Flow

```
npm run test:pact:parallel (PARALLEL=4)
  │
  ├─────────────────────────────────────────────────────┐
  │                                                      │
  ▼                                                      ▼
┌──────────────────┐                        ┌──────────────────┐
│   Cucumber       │                        │   Cucumber       │
│   Worker 1       │                        │   Worker 2       │
│                  │                        │                  │
│ Port: 9234       │                        │ Port: 9567       │
│ ID: a1b2c3d4     │                        │ ID: e5f6g7h8     │
│                  │                        │                  │
│ Scenario: Get    │                        │ Scenario: Create │
│ Users            │                        │ User             │
│                  │                        │                  │
│ ├─ Given: Setup  │                        │ ├─ Given: Setup  │
│ │ PACT Provider  │                        │ │ PACT Provider  │
│ │ on :9234       │                        │ │ on :9567       │
│ │                │                        │ │                │
│ ├─ When: Make    │                        │ ├─ When: Make    │
│ │ GET /users     │                        │ │ POST /users    │
│ │                │                        │ │                │
│ └─ Then: Verify  │                        │ └─ Then: Verify  │
│   Status 200     │                        │   Status 201     │
│                  │                        │                  │
│ ├─ After: Verify │                        │ ├─ After: Verify │
│ │ Contract       │                        │ │ Contract       │
│ │ Cleanup        │                        │ │ Cleanup        │
│                  │                        │                  │
└──────────────────┘                        └──────────────────┘
  │ reports/pacts/{pid}/a1b2c3d4/              │ reports/pacts/{pid}/e5f6g7h8/
  │ ├─ pact.log                                 │ ├─ pact.log
  │ └─ *.json                                   │ └─ *.json
  │                                             │
  ├─────────────────────────────────────────────┤
  │                                             │
  ▼                                             ▼
┌──────────────────┐                        ┌──────────────────┐
│   Cucumber       │                        │   Cucumber       │
│   Worker 3       │                        │   Worker 4       │
│                  │                        │                  │
│ Port: 9890       │                        │ Port: 9123       │
│ ID: i9j0k1l2     │                        │ ID: m3n4o5p6     │
│                  │                        │                  │
│ Scenario: Update │                        │ Scenario: Delete │
│ User             │                        │ User             │
│                  │                        │                  │
│ ├─ Given: Setup  │                        │ ├─ Given: Setup  │
│ │ PACT Provider  │                        │ │ PACT Provider  │
│ │ on :9890       │                        │ │ on :9123       │
│ │                │                        │ │                │
│ ├─ When: Make    │                        │ ├─ When: Make    │
│ │ PUT /users/:id │                        │ │ DELETE /users/:id
│ │                │                        │ │                │
│ └─ Then: Verify  │                        │ └─ Then: Verify  │
│   Status 200     │                        │   Status 204     │
│                  │                        │                  │
│ ├─ After: Verify │                        │ ├─ After: Verify │
│ │ Contract       │                        │ │ Contract       │
│ │ Cleanup        │                        │ │ Cleanup        │
│                  │                        │                  │
└──────────────────┘                        └──────────────────┘
  │ reports/pacts/{pid}/i9j0k1l2/              │ reports/pacts/{pid}/m3n4o5p6/
  │ ├─ pact.log                                 │ ├─ pact.log
  │ └─ *.json                                   │ └─ *.json
  │                                             │
  └─────────────────────────────────────────────┘
                    │
                    ▼ (All workers complete)
        ┌──────────────────────────────┐
        │  Merge Reports               │
        │  (npm run report)             │
        │                              │
        │ reports/                     │
        │ ├─ cucumber-report.json      │
        │ └─ cucumber-enhanced-report.html
        └──────────────────────────────┘
```

## Sequential Execution Flow

```
npm run test:pact (PARALLEL=1)
  │
  ▼
┌──────────────────────────────────┐
│   Cucumber Test Runner            │
│   (1 Worker Sequential)           │
└──────────────────────────────────┘
  │
  ├─► Scenario 1: Get users
  │   └─ Port: 9234, ID: a1b2c3d4
  │      └─ Report: reports/pacts/{pid}/a1b2c3d4/
  │
  ├─► Scenario 2: Create user
  │   └─ Port: 9567, ID: e5f6g7h8
  │      └─ Report: reports/pacts/{pid}/e5f6g7h8/
  │
  ├─► Scenario 3: Update user
  │   └─ Port: 9890, ID: i9j0k1l2
  │      └─ Report: reports/pacts/{pid}/i9j0k1l2/
  │
  ├─► Scenario 4: Delete user
  │   └─ Port: 9123, ID: m3n4o5p6
  │      └─ Report: reports/pacts/{pid}/m3n4o5p6/
  │
  └─► Scenario 5: Get user by ID (Sequential only)
      └─ Port: 9456, ID: n5o6p7q8
         └─ Report: reports/pacts/{pid}/n5o6p7q8/
  │
  ▼ (All scenarios complete)
Merge & Generate Reports
```

## Test Instance Isolation

```
Each Test Instance = Complete Isolation

┌─────────────────────────────────────────────┐
│        Test Instance (Worker 1)              │
├─────────────────────────────────────────────┤
│                                              │
│  Instance ID: a1b2c3d4e5f6g7h8              │
│  PID: 12345                                 │
│  Port: 9234                                 │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  PACT Mock Provider                  │    │
│  │  Consumer: PlaywrightConsumer        │    │
│  │  Provider: UsersApiProvider          │    │
│  │  URL: http://localhost:9234          │    │
│  │                                      │    │
│  │  Interactions:                       │    │
│  │  ├─ GET /users → [users]             │    │
│  │  ├─ POST /users → user               │    │
│  │  ├─ PUT /users/:id → user            │    │
│  │  └─ DELETE /users/:id → no content   │    │
│  └─────────────────────────────────────┘    │
│           │                                  │
│           ▼                                  │
│  ┌─────────────────────────────────────┐    │
│  │  Test Execution                      │    │
│  │                                      │    │
│  │  1. Given: Provider running          │    │
│  │  2. And: Setup interaction           │    │
│  │  3. When: Make request               │    │
│  │  4. Then: Validate response          │    │
│  │  5. After: Verify & cleanup          │    │
│  └─────────────────────────────────────┘    │
│           │                                  │
│           ▼                                  │
│  ┌─────────────────────────────────────┐    │
│  │  Isolated Report Directory           │    │
│  │  reports/pacts/12345/a1b2c3d4/       │    │
│  │                                      │    │
│  │  ├─ pact.log                         │    │
│  │  ├─ PlaywrightConsumer-            │    │
│  │  │  UsersApiProvider.json            │    │
│  │  └─ [Additional contract files]     │    │
│  └─────────────────────────────────────┘    │
│                                              │
└─────────────────────────────────────────────┘
```

## Data Flow in a PACT Test

```
┌──────────────────────────────────────────────────────┐
│  Step 1: Before Hook (@pact)                          │
├──────────────────────────────────────────────────────┤
│  1. Generate instance ID (UUID)                       │
│  2. Create reports/pacts/{pid}/{id}/ directory        │
│  3. Initialize PACT Provider:                         │
│     ├─ Random port: 9000-9999                         │
│     ├─ Log file: reports/pacts/.../pact.log          │
│     ├─ Contract dir: reports/pacts/.../               │
│     └─ Setup complete                                 │
│  4. Store baseUrl = http://localhost:{port}           │
│  5. Log: [PACT] {id}: Provider setup at {baseUrl}    │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  Step 2: Given Steps                                 │
├──────────────────────────────────────────────────────┤
│  Given a Pact mock provider is running               │
│  └─ Assert baseUrl is defined                        │
│     └─ Log: [PACT] {id}: Provider ready              │
│                                                      │
│  And the API will [operation]                        │
│  └─ Add interaction to PACT provider                │
│     ├─ Define state (e.g., "users exist")           │
│     ├─ Define request (GET /users)                  │
│     └─ Define response (200, [users])               │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  Step 3: When Steps                                  │
├──────────────────────────────────────────────────────┤
│  When I [action] via the mock API                    │
│  └─ Execute axios request                           │
│     └─ Store response in variable                    │
│        ├─ response.status                            │
│        ├─ response.data                              │
│        └─ response.headers                           │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  Step 4: Then Steps                                  │
├──────────────────────────────────────────────────────┤
│  Then the Pact [assertion] should match              │
│  └─ Validate response                                │
│     ├─ expect(response.status).toBe(200)            │
│     ├─ expect(response.data).toEqual(expected)      │
│     ├─ expect(user.id).toBeDefined()                │
│     └─ Store results                                 │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│  Step 5: After Hook (@pact)                          │
├──────────────────────────────────────────────────────┤
│  1. Verify all interactions against provider:        │
│     └─ await provider.verify()                       │
│        ├─ Log: [PACT] {id}: Verification successful │
│        └─ Generate contract JSON files               │
│                                                      │
│  2. Finalize provider:                               │
│     └─ await provider.finalize()                     │
│        └─ Cleanup resources                          │
│                                                      │
│  3. Cleanup:                                         │
│     └─ Clear provider variable                       │
│                                                      │
│  Location: reports/pacts/{pid}/{id}/                 │
│  Files:    ├─ pact.log                               │
│            └─ PlaywrightConsumer-UsersApiProvider.json
└──────────────────────────────────────────────────────┘
                         │
                         ▼
         ┌──────────────────────────────┐
         │  Test Complete               │
         │  Move to Next Test Instance  │
         └──────────────────────────────┘
```

## Tag-Based Filtering Diagram

```
All PACT Tests
└─ @pact

├─ Feature Tag
│  └─ @pact @api @contract
│
├─ Execution Type
│  ├─ @parallel (4 scenarios)
│  │  ├─ @pact-get
│  │  ├─ @pact-create
│  │  ├─ @pact-update
│  │  └─ @pact-delete
│  │
│  └─ @pact-validation (1 scenario - sequential)
│
└─ Examples:
   # Run all PACT tests
   cucumber-js --tags '@pact'

   # Run only parallel tests
   cucumber-js --tags '@pact and @parallel'

   # Run only GET tests
   cucumber-js --tags '@pact-get'

   # Run GET or DELETE tests
   cucumber-js --tags '@pact-get or @pact-delete'

   # Run PACT but exclude validation
   cucumber-js --tags '@pact and not @pact-validation'
```

## Report Structure

```
reports/
├─ cucumber-report-{pid}.json        # Multiple JSON reports (one per worker)
├─ cucumber-report.json              # Merged report
├─ cucumber-enhanced-report.html     # HTML report
│
└─ pacts/
   └─ {process_id}/
      ├─ {instance_uuid_1}/
      │  ├─ pact.log
      │  ├─ PlaywrightConsumer-UsersApiProvider.json
      │  └─ *.json (other contract files)
      │
      ├─ {instance_uuid_2}/
      │  ├─ pact.log
      │  ├─ PlaywrightConsumer-UsersApiProvider.json
      │  └─ *.json (other contract files)
      │
      ├─ {instance_uuid_3}/
      │  ├─ pact.log
      │  ├─ PlaywrightConsumer-UsersApiProvider.json
      │  └─ *.json (other contract files)
      │
      └─ {instance_uuid_4}/
         ├─ pact.log
         ├─ PlaywrightConsumer-UsersApiProvider.json
         └─ *.json (other contract files)
```

## Key Concepts

### Port Allocation Strategy
```
Random Port Selection (9000-9999)
├─ Min: 9000
├─ Max: 9999
├─ Range: 1000 ports available
└─ Prevents conflicts even with 4+ parallel workers
```

### Instance Isolation Strategy
```
UUID-Based Isolation
├─ Each test gets unique 16-char hex ID
├─ Used in directory path: reports/pacts/{pid}/{id}/
├─ Used in logging: [PACT] {id}: message
└─ Enables independent operation and debugging
```

### Parallel Execution Strategy
```
Worker Process Distribution
├─ PARALLEL env var controls worker count
├─ Each worker independent and isolated
├─ No shared state between workers
└─ Results merged in final report
```

---

**Last Updated**: February 2026
