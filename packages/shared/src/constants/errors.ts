export const ErrorCodes = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_EXISTS: 'AUTH_USER_EXISTS',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  MODULE_NOT_FOUND: 'MODULE_NOT_FOUND',
  CALCULATOR_NOT_FOUND: 'CALCULATOR_NOT_FOUND',
  GOAL_NOT_FOUND: 'GOAL_NOT_FOUND',

  // Permission errors
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  ACCESS_FORBIDDEN: 'ACCESS_FORBIDDEN',

  // Module errors
  MODULE_LOCKED: 'MODULE_LOCKED',
  PREREQUISITES_NOT_MET: 'PREREQUISITES_NOT_MET',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export const ErrorMessages = {
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.AUTH_USER_EXISTS]: 'User with this email already exists',
  [ErrorCodes.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'Unauthorized access',

  [ErrorCodes.VALIDATION_ERROR]: 'Validation error',
  [ErrorCodes.INVALID_INPUT]: 'Invalid input provided',
  [ErrorCodes.MISSING_REQUIRED_FIELD]: 'Required field is missing',

  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.MODULE_NOT_FOUND]: 'Module not found',
  [ErrorCodes.CALCULATOR_NOT_FOUND]: 'Calculator not found',
  [ErrorCodes.GOAL_NOT_FOUND]: 'Goal not found',

  [ErrorCodes.PERMISSION_DENIED]: 'Permission denied',
  [ErrorCodes.ACCESS_FORBIDDEN]: 'Access forbidden',

  [ErrorCodes.MODULE_LOCKED]: 'Module is locked. Complete prerequisites first',
  [ErrorCodes.PREREQUISITES_NOT_MET]: 'Prerequisites not met',

  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please try again later',

  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCodes.DATABASE_ERROR]: 'Database error',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
