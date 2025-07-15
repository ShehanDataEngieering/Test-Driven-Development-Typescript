// Integration test setup for Testcontainers
// You can use a logger here if needed, or rely on Jest's setup reporting
// Example: logger.info('🔧 Setting up integration tests with Testcontainers...');

// Set test environment variables
process.env.NODE_ENV = 'test';

// Default values (will be overridden by Testcontainers)
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.DB_NAME = process.env.DB_NAME || 'tdd_test';
process.env.DB_USER = process.env.DB_USER || 'testuser';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'testpass';

// You can use a logger here if needed, or rely on Jest's setup reporting
// Example: logger.info('🐳 Testcontainers will override database configuration automatically');
// Example: logger.info('🚀 Integration tests ready with isolated containers!');
