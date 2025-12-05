# API Documentation

Complete REST API reference for the Finance Learning Platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.yourdomain.com/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Core Endpoints
- [Authentication](./authentication.md) - User registration, login, logout
- [Users & Profile](./users.md) - User management and profiles
- [Modules & Progress](./modules.md) - Learning modules and progress tracking
- [Calculators & Goals](./calculators-goals.md) - Financial calculators and goal management

### Educational Enhancement Endpoints
- [Educational Enhancement](./educational-enhancement.md) - Adaptive learning, wellness, support, holistic education, and reflection

### Administrative Endpoints
- [Admin](./admin.md) - Admin console and analytics (admin only)

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `304` - Not Modified (cached)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. Recommended for production:
- Authentication endpoints: 5 requests/minute
- Other endpoints: 100 requests/minute

## Pagination

Endpoints that return lists support pagination:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

## Filtering & Sorting

Many list endpoints support:
- `filter` - Filter criteria (varies by endpoint)
- `sort` - Sort field and direction (e.g., `created_at:desc`)
- `search` - Search query

See individual endpoint documentation for details.

