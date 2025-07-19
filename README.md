# TDD TypeScript Node.js CRUD Project

This project demonstrates **Test-Driven Development (TDD)** principles with TypeScript and Node.js for CRUD operations.

## Testing Strategy

This project demonstrates a comprehensive testing approach:

### 🏃‍♂️ **Unit Tests** (Fast - In Memory)
- **Location**: `*.test.ts` files
- **Purpose**: Test business logic in isolation
- **Speed**: Very fast (milliseconds)
- **When to use**: TDD development, quick feedback
- **Command**: `npm test`

### 🔗 **Integration Tests** (Real Database)
- **Location**: `*.integration.test.ts` files
- **Purpose**: Test database interactions with real PostgreSQL
- **Speed**: Slower (seconds)
- **When to use**: Verify database operations work correctly
- **Command**: `npm run test:integration`

### 🐳 **Testcontainers Benefits**
- **Isolated**: Each test gets a fresh database container
- **Portable**: Works on any machine with Docker
- **Reliable**: No shared state between test runs
- **CI/CD Ready**: Perfect for automated pipelines

### 📊 **Testing Pyramid**
```
   🔺 E2E Tests (Few, Slow)
  🔺🔺 Integration Tests (Some, Medium) ← You have this!
 🔺🔺🔺 Unit Tests (Many, Fast) ← You have this!
```

## TDD Process: Red-Green-Refactor

### 🔴 RED Phase
- Write failing tests first
- Tests should define the expected behavior
- Run tests to see them fail (confirming they work)

### 🟢 GREEN Phase  
- Write minimal code to make tests pass
- Don't worry about perfect code, just make it work
- Run tests to see them pass

### 🔵 REFACTOR Phase
- Improve code quality while keeping tests green
- Clean up, optimize, and make code more maintainable
- Run tests after each refactor to ensure nothing breaks

## Current Status: � GREEN + 🔵 REFACTOR Phase
All tests are now passing! We've completed the implementation and are now refactoring for better code quality.

## Recent Refactoring Improvements

### ✅ **Modular Utility Functions**
We've refactored the codebase to separate concerns into dedicated utility modules:

- **ErrorHandlers.ts**: Centralized error handling
  - `handleDbError`: General database error handling
  - `handleNotFoundError`: Specialized handling for "not found" errors
  - `validateRequired`: Parameter validation

- **ValidationUtils.ts**: Input validation
  - `validateUserInput`: User input validation
  - `validateOptionalField`: Optional field validation
  - `isValidEmail`: Email format validation

- **DataUtils.ts**: Data manipulation
  - `generateId`: Unique ID generation
  - `mapRowToUser`: Database row to User object mapping

### ✅ **Improved Error Handling**
- Consistent error messages across the application
- Specialized handling for different error types
- Structured approach to error propagation

### ✅ **Better Test Organization**
- Clear mocking strategies for all utility functions
- Improved test readability and maintainability
- Tests adapted to work with the new modular structure

## Available Scripts

```bash
# Unit Tests (Fast - In-Memory)
npm test                    # Run unit tests once
npm run test:watch          # Run unit tests in watch mode
npm run test:coverage       # Run unit tests with coverage

# Integration Tests (Real Database)
npm run test:integration    # Run integration tests with PostgreSQL
npm run test:integration:watch # Run integration tests in watch mode
npm run test:all           # Run both unit and integration tests

# Development
npm run build              # Build TypeScript to JavaScript
npm run dev               # Run in development mode
```

## Database Setup

### Using Testcontainers (Recommended) 🐳

**No manual setup required!** Testcontainers will automatically:
- Start a fresh PostgreSQL container for each test run
- Create isolated test databases
- Clean up containers after tests complete

Simply run:
```bash
npm run test:integration
```

**Prerequisites:**
- Docker must be installed and running
- No manual PostgreSQL setup needed

**Benefits:**
- ✅ **Isolated**: Each test run gets a fresh database
- ✅ **Portable**: Works on any machine with Docker
- ✅ **No conflicts**: No need to manage test databases manually
- ✅ **CI/CD ready**: Perfect for automated testing pipelines

### Using Docker Compose (Alternative)

If you prefer to manage the container manually:

1. **Start PostgreSQL container:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Run integration tests:**
   ```bash
   npm run test:integration
   ```

3. **Stop PostgreSQL container:**
   ```bash
   docker-compose down
   ```

### Manual PostgreSQL Setup

If you prefer to use your existing PostgreSQL:

1. **Create test database:**
   ```sql
   CREATE DATABASE tdd_test;
   ```

2. **Update connection settings** in `src/test-setup/integration.setup.ts`

3. **Run integration tests:**
   ```bash
   npm run test:integration
   ```

## Project Structure

```
├── src/                             # Source code (production)
│   ├── types/
│   │   └── User.ts                  # User interfaces and types
│   ├── repositories/
│   │   ├── BaseUserRepository.ts    # Abstract base repository
│   │   ├── UserRepository.ts        # In-memory implementation
│   │   └── UserRepositoryPostgres.ts # PostgreSQL implementation
│   ├── database/
│   │   ├── connection.ts            # Database connection
│   │   └── SQLQueryLoader.ts        # SQL query loading utility
│   ├── utils/
│   │   ├── ErrorHandlers.ts         # Error handling utilities
│   │   ├── ValidationUtils.ts       # Input validation utilities
│   │   └── DataUtils.ts             # Data mapping and ID generation
│   └── index.ts                     # Entry point
├── tests/                           # All test files (separate from source)
│   ├── unit/                        # Unit tests (fast, isolated)
│   │   └── repositories/
│   │       └── UserRepository.test.ts
│   ├── integration/                 # Integration tests (with real database)
│   │   └── repositories/
│   │       └── UserRepositoryPostgres.integration.test.ts
│   ├── e2e/                         # End-to-end tests (full application)
│   ├── fixtures/                    # Test data and factories
│   │   └── UserTestData.ts
│   ├── mocks/                       # Mock implementations
│   │   ├── ValidationUtils.mock.ts  # Mock validation utilities
│   │   ├── DataUtils.mock.ts        # Mock data utilities
│   │   ├── ErrorHandlers.mock.ts    # Mock error handlers
│   │   └── database.mock.ts         # Mock database connections
│   ├── setup/                       # Test configuration
│   │   └── integration.setup.ts
│   └── README.md                    # Testing documentation
├── docker-compose.yml               # Database containers
├── jest.config.js                   # Unit test configuration
├── jest.integration.config.js       # Integration test configuration
└── package.json                     # Dependencies and scripts
```

## Benefits of Improved Structure

### ✅ **Clear Separation of Concerns**
- **Source code** (`src/`) contains only production code
- **Tests** (`tests/`) are completely separate and organized by type
- **No test files mixed** with production code

### ✅ **Better Organization**
- **Unit tests**: Fast, isolated tests for business logic
- **Integration tests**: Tests with real databases
- **E2E tests**: Complete application workflow tests
- **Fixtures**: Reusable test data
- **Mocks**: Test doubles for dependencies

### ✅ **Scalability**
- Easy to find and manage tests as project grows
- Clear naming conventions (`*.test.ts`, `*.integration.test.ts`)
- Separate test configurations for different test types

### ✅ **Team Collaboration**
- New developers can quickly understand test structure
- Clear documentation in `tests/README.md`
- Consistent patterns across the project

## Next Steps

1. ✅ **Implement the `create` method** - COMPLETED
2. ✅ **Implement the `findById` method** - COMPLETED
3. ✅ **Implement the `findAll` method** - COMPLETED
4. ✅ **Implement the `update` method** - COMPLETED
5. ✅ **Implement the `delete` method** - COMPLETED
6. ✅ **Refactor utilities into separate modules** - COMPLETED
7. **Consider implementing additional features:**
   - User authentication
   - Role-based access control
   - API endpoints with Express
   - Frontend integration

## TDD Benefits

- **Design First**: Tests force you to think about the API design
- **Confidence**: High test coverage from the start
- **Documentation**: Tests serve as living documentation
- **Regression Protection**: Prevents breaking existing functionality
- **Better Code**: TDD often leads to cleaner, more modular code

## Refactoring Best Practices

1. **Keep Tests Green**: Always ensure tests pass after each refactor
2. **Small Steps**: Make incremental changes, not massive rewrites
3. **Separation of Concerns**: Move related functionality to dedicated modules
4. **DRY (Don't Repeat Yourself)**: Extract common code into reusable functions
5. **Readability**: Make code easier to understand, even if it means more lines
6. **Consistency**: Follow the same patterns throughout the codebase
