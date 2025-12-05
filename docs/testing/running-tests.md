# Running Tests

Guide for running tests in the Finance Learning Platform.

## Prerequisites

1. Docker containers running:
   ```bash
   docker-compose up -d
   ```

2. Database migrations applied:
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

3. Prisma Client generated:
   ```bash
   docker-compose exec backend npx prisma generate
   ```

## Running Tests

### All Tests

Run the complete test suite:
```bash
docker-compose exec backend npm test
```

Or from the backend directory:
```bash
docker-compose exec backend sh -c "cd /app/packages/backend && npm test"
```

### Specific Test File

Run a single test file:
```bash
docker-compose exec backend npx jest src/__tests__/integration/auth.test.ts
```

### Tests Matching Pattern

Run tests matching a pattern:
```bash
docker-compose exec backend npx jest auth
docker-compose exec backend npx jest admin
docker-compose exec backend npx jest integration
```

### Watch Mode

Run tests in watch mode (re-runs on file changes):
```bash
docker-compose exec backend npx jest --watch
```

### Verbose Output

Get detailed test output:
```bash
docker-compose exec backend npx jest --verbose
```

## Test Options

### Coverage Report

Generate coverage report:
```bash
docker-compose exec backend npm test -- --coverage
```

Coverage reports are generated in `packages/backend/coverage/`

### Force Exit

Force Jest to exit after tests (useful if tests hang):
```bash
docker-compose exec backend npx jest --forceExit
```

### Test Timeout

Override default timeout (default: 10 seconds):
```bash
docker-compose exec backend npx jest --testTimeout=30000
```

### Max Workers

Limit parallel test execution:
```bash
docker-compose exec backend npx jest --maxWorkers=1
```

### Update Snapshots

Update snapshot files:
```bash
docker-compose exec backend npx jest --updateSnapshot
```

## Test Environment Variables

Tests use these environment variables (set automatically):
- `NODE_ENV=test`
- `JWT_SECRET=test-secret-key-for-testing-only`
- `DATABASE_URL` - Same as development database

## Common Commands

### Quick Test Run
```bash
# Run all tests with coverage
docker-compose exec backend npm test -- --coverage --forceExit

# Run integration tests only
docker-compose exec backend npx jest src/__tests__/integration/

# Run unit tests only
docker-compose exec backend npx jest src/__tests__/services/
```

### Debugging Tests

Run a single test with detailed output:
```bash
docker-compose exec backend npx jest src/__tests__/integration/auth.test.ts --verbose --no-coverage
```

### Test Specific Function

Use `.only()` in test file:
```typescript
it.only('should login successfully', async () => {
  // Only this test runs
});
```

### Skip Tests

Use `.skip()` in test file:
```typescript
it.skip('should do something', async () => {
  // This test is skipped
});
```

## CI/CD Integration

For CI/CD pipelines, use:
```bash
docker-compose exec backend npm test -- --coverage --forceExit --ci
```

The `--ci` flag:
- Runs tests in CI mode
- Prevents watch mode
- Uses single worker
- Fails if no tests found

## Troubleshooting

### Tests Hang

If tests hang indefinitely:
1. Check for unclosed Prisma connections
2. Use `--forceExit` flag
3. Check for infinite loops in test code
4. Verify database is accessible

### Database Errors

If you see database connection errors:
1. Ensure PostgreSQL container is running
2. Check `DATABASE_URL` environment variable
3. Verify migrations are applied
4. Regenerate Prisma Client

### Type Errors

If TypeScript errors occur:
1. Regenerate Prisma Client: `npx prisma generate`
2. Restart TypeScript server in IDE
3. Check `tsconfig.json` includes test files
4. Verify type augmentation files are included

### Port Conflicts

If port 3000 is in use:
- Tests use a test Express app that doesn't start a server
- If issues persist, check for other processes using port 3000

## Performance

### Test Execution Time

Current test suite execution times:
- Unit tests: ~0.5 seconds
- Integration tests: ~2 seconds
- Total: ~2.5 seconds

### Optimizing Test Speed

1. Use `--maxWorkers` to control parallelism
2. Group related tests in describe blocks
3. Use `beforeAll` for expensive setup
4. Clean up test data efficiently

## Next Steps

- See [Writing Tests](./writing-tests.md) for how to write new tests
- See [Integration Tests](./integration-tests.md) for integration test patterns
- See [Test Coverage](./coverage.md) for coverage goals

