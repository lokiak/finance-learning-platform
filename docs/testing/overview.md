# Testing Overview

Comprehensive testing infrastructure for the Finance Learning Platform.

## Testing Stack

### Backend Testing
- **Framework**: Jest 29.7.0
- **Test Runner**: Jest CLI
- **Assertions**: Jest built-in matchers
- **HTTP Testing**: Supertest 7.1.4
- **TypeScript**: ts-jest 29.4.6

### Frontend Testing
- **Framework**: Vitest (planned)
- **Component Testing**: React Testing Library (planned)
- **E2E Testing**: Playwright (planned)

## Test Structure

```
packages/backend/src/__tests__/
├── setup.ts                 # Test environment setup
├── helpers/
│   └── testApp.ts          # Test Express app factory
├── services/                # Unit tests for services
│   ├── authService.test.ts
│   └── adminAnalyticsService.test.ts
└── integration/             # Integration tests
    ├── auth.test.ts
    └── admin.test.ts
```

## Test Types

### Unit Tests
Test individual functions and services in isolation:
- Service layer logic
- Utility functions
- Validators
- Business logic

**Location**: `src/__tests__/services/`

### Integration Tests
Test API endpoints end-to-end:
- HTTP request/response flow
- Database interactions
- Authentication/authorization
- Error handling

**Location**: `src/__tests__/integration/`

## Running Tests

### Run All Tests
```bash
docker-compose exec backend npm test
```

### Run Specific Test File
```bash
docker-compose exec backend npx jest src/__tests__/integration/auth.test.ts
```

### Run Tests in Watch Mode
```bash
docker-compose exec backend npx jest --watch
```

### Run Tests with Coverage
```bash
docker-compose exec backend npm test -- --coverage
```

### Run Tests Matching Pattern
```bash
docker-compose exec backend npx jest auth
```

## Test Configuration

Configuration is in `packages/backend/jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  testTimeout: 10000,
  // ... more config
};
```

## Test Environment

Tests run with:
- `NODE_ENV=test`
- Test database (same as dev, but isolated via cleanup)
- Mock JWT secret for token generation
- Isolated Express app instance

## Writing Tests

See [Writing Tests](./writing-tests.md) for detailed guidelines.

## Test Coverage

Current coverage:
- **Services**: authService, adminAnalyticsService
- **Integration**: Authentication, Admin routes
- **Coverage Target**: 80%+ for critical paths

See [Test Coverage](./coverage.md) for details.

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data in `afterAll`
3. **Naming**: Use descriptive test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Timeouts**: Set appropriate timeouts for async operations

## Common Issues

### Tests Hanging
- Ensure Prisma connections are closed in `afterAll`
- Use `--forceExit` flag if needed
- Check for unhandled promises

### Database State
- Tests clean up their own data
- Use unique identifiers (emails with `test_` prefix)
- Don't rely on test execution order

### Type Errors
- Ensure Prisma Client is regenerated after schema changes
- Use type-safe helpers from `prismaHelpers.ts`

## Next Steps

- [ ] Add more unit tests for services
- [ ] Add frontend component tests
- [ ] Add E2E tests
- [ ] Set up CI/CD test pipeline
- [ ] Add performance tests

