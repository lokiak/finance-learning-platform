// Test setup file
// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://finance_user:finance_password@postgres:5432/finance_platform_dev';

