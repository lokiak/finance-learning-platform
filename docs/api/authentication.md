# Authentication API

Endpoints for user authentication and session management.

**Base Path**: `/api/auth`

## Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Validation:**
- Email: Valid email format
- Password: Min 8 characters, must contain uppercase, lowercase, and number
- Name: 1-255 characters

**Response (201):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "last_login": "2024-01-01T00:00:00.000Z",
    "profile_completed": false
  }
}
```

**Error Responses:**
- `409` - User already exists
- `400` - Validation error

### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "last_login": "2024-01-01T00:00:00.000Z",
    "profile_completed": false
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `400` - Validation error

### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "last_login": "2024-01-01T00:00:00.000Z",
    "profile_completed": false,
    "profile": {
      "id": "uuid",
      "age": 28,
      "current_income": 75000.00,
      "financial_goals": ["Save for house", "Retirement"],
      "risk_tolerance": "moderate",
      "has_debt": true,
      "has_emergency_fund": false
    }
  }
}
```

**Caching:**
- Supports ETag-based conditional requests
- Returns `304 Not Modified` if user data unchanged
- ETag includes `updated_at` timestamp and role

**Error Responses:**
- `401` - Unauthorized (missing or invalid token)

### POST /api/auth/logout
Logout current user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** This endpoint is primarily for client-side cleanup. The JWT token remains valid until expiration. Clients should remove the token from storage.

## Authentication Flow

1. User registers/logs in via frontend
2. Backend validates credentials and generates JWT
3. Frontend stores JWT in localStorage
4. JWT included in Authorization header for protected routes
5. Backend middleware verifies JWT on each request

## JWT Token

**Expiration:** 24 hours

**Payload:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT signed with secret key
- Tokens validated on every request
- Role-based access control supported

## Error Codes

- `AUTH_USER_EXISTS` - Email already registered
- `AUTH_INVALID_CREDENTIALS` - Invalid email/password
- `AUTH_UNAUTHORIZED` - Missing or invalid token
- `AUTH_TOKEN_EXPIRED` - Token has expired
- `AUTH_TOKEN_INVALID` - Token is invalid

