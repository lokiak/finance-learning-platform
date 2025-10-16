export const LIMITS = {
  // String lengths
  MAX_NAME_LENGTH: 255,
  MAX_EMAIL_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_NOTES_LENGTH: 5000,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_CONTEXT_LENGTH: 500,

  // Password
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,

  // Financial values
  MAX_AMOUNT: 999999999999.99,
  MIN_AGE: 18,
  MAX_AGE: 120,
  MAX_PERCENTAGE: 100,
  MIN_PERCENTAGE: 0,

  // Arrays
  MAX_GOALS: 50,
  MAX_CALCULATORS: 100,
  MAX_ASSETS: 100,
  MAX_LIABILITIES: 100,
  MAX_EXPENSES: 100,
  MAX_DEBTS: 50,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  RATE_LIMIT_AI_MAX_REQUESTS: 20,

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Sessions
  JWT_EXPIRATION: '24h',
  REFRESH_TOKEN_EXPIRATION: '7d',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${LIMITS.MIN_PASSWORD_LENGTH} characters`,
  PASSWORD_REQUIREMENTS: 'Password must contain uppercase, lowercase, and number',
  INVALID_AGE: `Age must be between ${LIMITS.MIN_AGE} and ${LIMITS.MAX_AGE}`,
  INVALID_AMOUNT: 'Amount must be a positive number',
  INVALID_PERCENTAGE: `Percentage must be between ${LIMITS.MIN_PERCENTAGE} and ${LIMITS.MAX_PERCENTAGE}`,
  STRING_TOO_LONG: 'Input is too long',
} as const;
