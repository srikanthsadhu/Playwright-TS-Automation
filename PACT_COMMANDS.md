# PACT Testing - Command Reference Card

## 🚀 Most Common Commands

### Start Here - Run All PACT Tests in Parallel
```bash
npm run test:pact:parallel
```
✅ Runs 4 scenarios in parallel workers (~2-3 seconds)
✅ Generates HTML report
✅ Fastest option for CI/CD

### View Results
```bash
npm run report:open
```
Opens the HTML report in your browser

---

## 📋 Full Command Reference

### Run All Tests
| Command | Description | Workers | Time |
|---------|-------------|---------|------|
| `npm run test:pact` | All scenarios, sequential | 1 | ~8-10s |
| `npm run test:pact:parallel` | All parallel scenarios | 4 | ~2-3s |

### Run Specific Operations
| Command | Tests | Tags |
|---------|-------|------|
| `npm run test:pact:get` | GET /users | @pact-get |
| `npm run test:pact:create` | POST /users | @pact-create |
| `npm run test:pact:update` | PUT /users/:id | @pact-update |
| `npm run test:pact:delete` | DELETE /users/:id | @pact-delete |
| `npm run test:pact:validation` | GET /users/:id | @pact-validation |

### Environment-Specific
| Command | Environment | Execution |
|---------|-------------|-----------|
| `npm run test:pact:dev` | Development | Sequential |
| `npm run test:pact:parallel:dev` | Development | Parallel (4) |
| `npm run test:pact:parallel:qa` | QA | Parallel (4) |

### Custom Configuration
```bash
# Run with 8 parallel workers
PARALLEL=8 npm run test:pact:parallel

# Run with 2 parallel workers
PARALLEL=2 npm run test:pact:parallel

# Run specific environment with custom workers
ENV=qa PARALLEL=6 npm run test:pact:parallel

# Clean reports first, then run tests
npm run clean:reports && npm run test:pact:parallel
```

---

## 🎯 Typical Workflows

### Quick Local Test
```bash
npm run test:pact:get
```

### Full Test Suite
```bash
npm run test:pact:parallel && npm run report:open
```

### Development Work
```bash
# Run specific operation being developed
npm run test:pact:create

# View results
npm run report:open
```

### CI/CD Pipeline
```bash
npm run test:pact:parallel
npm run report
# Upload reports/ directory as artifact
```

### Debugging Failed Test
```bash
# Run specific test
npm run test:pact:get

# Clean and retry
npm run clean:reports && npm run test:pact:get

# View detailed logs
cat reports/pacts/*/*/pact.log
```

---

## 📊 Test Matrix Reference

| Scenario | Endpoint | Method | Status | Tag | Parallel |
|----------|----------|--------|--------|-----|----------|
| Get users | /users | GET | 200 | @pact-get | ✓ |
| Get user by ID | /users/1 | GET | 200 | @pact-validation | ✗ |
| Create user | /users | POST | 201 | @pact-create | ✓ |
| Update user | /users/1 | PUT | 200 | @pact-update | ✓ |
| Delete user | /users/1 | DELETE | 204 | @pact-delete | ✓ |

---

## 🏷️ Tag-Based Filtering

### Using Cucumber Tags Directly
```bash
# Run all PACT tests
cucumber-js --tags '@pact'

# Run only parallel scenarios
cucumber-js --tags '@pact and @parallel'

# Run GET or DELETE only
cucumber-js --tags '@pact-get or @pact-delete'

# Run PACT but exclude validation
cucumber-js --tags '@pact and not @pact-validation'

# Run specific operation
cucumber-js --tags '@pact-create'
```

---

## 📁 File Locations

### Test Files
```
src/features/pact/
├─ pact_users_api.feature      ← Test scenarios
└─ README.md                    ← Full documentation

src/steps/pact/
└─ pact.steps.ts               ← Step implementations
```

### Configuration
```
cucumber.js                     ← Test runner config
package.json                   ← npm scripts
```

### Reports & Logs
```
reports/
├─ cucumber-report.json        ← Test results JSON
├─ cucumber-enhanced-report.html ← HTML report
└─ pacts/
   └─ {pid}/{uuid}/            ← Individual test logs
      ├─ pact.log
      └─ *.json
```

### Documentation
```
src/features/pact/
├─ README.md                   ← Full guide
└─ QUICK_REFERENCE.md          ← Quick commands

Root/
├─ PACT_QUICK_START.md         ← Getting started
├─ PACT_IMPLEMENTATION.md      ← What was built
└─ PACT_ARCHITECTURE.md        ← System design
```

---

## 🔧 Customization

### Change Default Parallel Workers
Edit `package.json`:
```json
"test:pact:parallel": "PARALLEL=8 cucumber-js ..."
```

### Change Port Range
Edit `src/steps/pact/pact.steps.ts`:
```typescript
const getRandomPort = () => {
  const min = 8000;  // Change from 9000
  const max = 8999;  // Change from 9999
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
```

### Add Environment
Edit `package.json`:
```json
"test:pact:stage": "ENV=stage npm run test:pact:parallel"
```

---

## 🐛 Troubleshooting

### Port Already in Use
**Error**: Address already in use
**Solution**: Port range is 9000-9999, change in `pact.steps.ts`
```bash
# Or wait for processes to finish
lsof -i :9000-9999 | kill -9 $(awk '{print $2}' | tail -n +2)
```

### Tests Failing
**Step 1**: Check logs
```bash
cat reports/pacts/*/*/pact.log
```

**Step 2**: Run single test
```bash
npm run test:pact:get
```

**Step 3**: View HTML report
```bash
npm run report:open
```

### Out of Memory
**Solution**: Reduce parallel workers
```bash
PARALLEL=2 npm run test:pact:parallel
```

Or increase Node memory:
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run test:pact:parallel
```

### Report Not Generated
**Solution**: Clean and regenerate
```bash
npm run clean:reports && npm run test:pact && npm run report:open
```

---

## ✅ Quick Health Check

Run this to verify everything works:
```bash
# Test 1: Run one operation
npm run test:pact:get

# Test 2: Run parallel
npm run test:pact:parallel

# Test 3: View report
npm run report:open
```

If all 3 work, you're good to go! ✅

---

## 📚 Documentation Map

```
Want to...                              See...
────────────────────────────────────────────────────
Get started quickly                     PACT_QUICK_START.md
Run tests immediately                   This file (commands)
Understand the system                   PACT_ARCHITECTURE.md
Read full documentation                 src/features/pact/README.md
Find quick commands                     src/features/pact/QUICK_REFERENCE.md
See what was implemented                PACT_IMPLEMENTATION.md
```

---

## 🎯 Common Scenarios

### Scenario 1: First Time Run
```bash
npm run test:pact:parallel && npm run report:open
```

### Scenario 2: Debugging Specific Test
```bash
npm run test:pact:create
cat reports/pacts/*/*/pact.log
npm run report:open
```

### Scenario 3: CI/CD Build
```bash
npm run test:pact:parallel
npm run report
# Upload reports/ as artifact
```

### Scenario 4: Pre-Commit Check
```bash
npm run test:pact:get && npm run test:pact:create
```

### Scenario 5: Nightly Build (All Tests)
```bash
PARALLEL=8 npm run test:pact:parallel
npm run report
```

---

## 💡 Pro Tips

### Faster Local Testing
```bash
# Test single operation while developing
npm run test:pact:create
```

### Better Debugging
```bash
# Run test and keep browser open to view logs
npm run test:pact:get && npm run report:open
```

### Parallel Performance
```bash
# Use more workers if you have CPU power
PARALLEL=8 npm run test:pact:parallel
```

### Clean Slate
```bash
# Remove old reports before running
npm run clean:reports && npm run test:pact:parallel
```

---

## 📞 Getting Help

### For Command Usage
👉 This file or `src/features/pact/QUICK_REFERENCE.md`

### For Full Documentation
👉 `src/features/pact/README.md`

### For Architecture Details
👉 `PACT_ARCHITECTURE.md`

### For Step Definitions
👉 `src/steps/pact/pact.steps.ts`

---

**Last Updated**: February 2026
**Status**: Ready to Use ✅
**Quick Start**: `npm run test:pact:parallel && npm run report:open`
