module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/db/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@finance-platform/shared$': '<rootDir>/../../packages/shared/src',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node'],
      },
    },
  },
};

