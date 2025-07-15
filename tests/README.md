# Tests Directory

This directory contains all test-related files organized by test type and purpose.

## Structure

```
tests/
├── unit/                    # Unit tests - fast, isolated tests
│   └── repositories/        # Unit tests for repository layer
├── integration/             # Integration tests - tests with external dependencies
│   └── repositories/        # Integration tests for repository layer
├── e2e/                     # End-to-end tests - full application flow tests
├── fixtures/                # Test data and fixtures
├── mocks/                   # Mock implementations for testing
└── setup/                   # Test setup and configuration files
```

## Test Types

### Unit Tests (`tests/unit/`)
- Fast execution (< 100ms per test)
- No external dependencies (database, network, filesystem)
- Test individual functions, classes, or modules in isolation
- Use mocks and stubs for dependencies

### Integration Tests (`tests/integration/`)
- Test interaction between components
- May use real databases (via Testcontainers)
- Test repository implementations with actual database
- Slower execution but higher confidence

### End-to-End Tests (`tests/e2e/`)
- Test complete user workflows
- Test the entire application stack
- Highest confidence, slowest execution
- Use real services when possible

## Running Tests

```bash
# Run only unit tests (fast)
npm test

# Run only integration tests
npm run test:integration

# Run all tests
npm run test:all

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Best Practices

1. **Test file naming:**
   - Unit tests: `*.test.ts`
   - Integration tests: `*.integration.test.ts`
   - E2E tests: `*.e2e.test.ts`

2. **Test organization:**
   - Mirror the `src/` directory structure in `tests/unit/`
   - Group related tests in describe blocks
   - Use clear, descriptive test names

3. **Test data:**
   - Use fixtures for complex test data
   - Keep test data in `tests/fixtures/`
   - Use factories for creating test objects

4. **Mocks:**
   - Store reusable mocks in `tests/mocks/`
   - Reset mocks between tests
   - Mock external dependencies in unit tests
