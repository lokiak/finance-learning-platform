# Environment Configuration

Environment variables and configuration for production deployment.

## Backend Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Application
NODE_ENV=production
PORT=3000
```

### Optional Variables

```bash
# CORS (if different from default)
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Frontend Environment Variables

### Required Variables

```bash
# API URL
VITE_API_URL=https://api.yourdomain.com
```

### Optional Variables

```bash
# Analytics (if using)
VITE_ANALYTICS_ID=your-analytics-id

# Feature Flags
VITE_ENABLE_FEATURE_X=true
```

## Environment File Structure

### Development (.env)

```bash
# Database
POSTGRES_USER=finance_user
POSTGRES_PASSWORD=finance_password
POSTGRES_DB=finance_platform_dev
DATABASE_URL=postgresql://finance_user:finance_password@postgres:5432/finance_platform_dev

# Backend
JWT_SECRET=change-this-secret-in-production
NODE_ENV=development
PORT=3000

# Frontend
VITE_API_URL=http://localhost:3000
```

### Production (.env.production)

```bash
# Database (use managed database URL)
DATABASE_URL=postgresql://prod_user:secure_password@db.provider.com:5432/finance_platform_prod

# Backend
JWT_SECRET=<generate-strong-random-secret-32-plus-characters>
NODE_ENV=production
PORT=3000

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

## Generating Secrets

### JWT Secret

Generate a strong secret key:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Requirements:**
- Minimum 32 characters
- Random and unpredictable
- Different for each environment
- Stored securely (never commit to Git)

## Security Best Practices

### Secret Management

1. **Never commit secrets** to version control
2. **Use environment variables** for all secrets
3. **Rotate secrets** periodically
4. **Use different secrets** for each environment
5. **Store securely** (use secret management service in production)

### Database URL

- Use connection pooling parameters
- Include SSL mode for production
- Use read replicas if available
- Example: `postgresql://user:pass@host:5432/db?sslmode=require&pool_timeout=20`

### CORS Configuration

Production CORS should be restrictive:

```bash
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

## Platform-Specific Configuration

### Railway

Set environment variables in Railway dashboard:
1. Go to project settings
2. Navigate to Variables
3. Add each variable
4. Redeploy application

### Render

Set environment variables in Render dashboard:
1. Go to service settings
2. Navigate to Environment
3. Add variables
4. Save and redeploy

### AWS ECS

Use AWS Systems Manager Parameter Store or Secrets Manager:
1. Store secrets in Parameter Store
2. Reference in task definition
3. Use IAM roles for access

### Vercel/Netlify

Set environment variables in dashboard:
1. Go to project settings
2. Navigate to Environment Variables
3. Add variables for each environment
4. Redeploy

## Validation

### Backend Startup Validation

The backend validates required environment variables on startup:

```typescript
// Required variables checked:
- DATABASE_URL
- JWT_SECRET
- NODE_ENV
```

Missing variables will cause startup failure with clear error messages.

### Frontend Build Validation

Frontend validates required variables at build time:

```typescript
// Required variables checked:
- VITE_API_URL
```

Missing variables will cause build failure.

## Testing Environment Variables

### Local Testing

Use `.env.test` file:

```bash
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
JWT_SECRET=test-secret-key-for-testing-only
NODE_ENV=test
```

### CI/CD Testing

Set environment variables in CI/CD platform:
- GitHub Actions: Repository secrets
- GitLab CI: CI/CD variables
- CircleCI: Environment variables

## Environment-Specific Configurations

### Development
- Verbose logging
- Detailed error messages
- CORS allows localhost
- No rate limiting
- Development database

### Staging
- Moderate logging
- Sanitized error messages
- CORS allows staging domain
- Rate limiting enabled
- Staging database

### Production
- Minimal logging (errors only)
- Sanitized error messages
- CORS restricted to production domain
- Strict rate limiting
- Production database with backups

## Monitoring Environment Variables

Track these in monitoring:
- `NODE_ENV` - Environment type
- `DATABASE_URL` - Database connection (masked)
- Application version
- Deployment timestamp

## Troubleshooting

### Missing Environment Variables

Error: `JWT_SECRET is not defined`
- Check `.env` file exists
- Verify variable name spelling
- Ensure file is loaded (check dotenv config)

### Database Connection Issues

Error: `Can't reach database server`
- Verify `DATABASE_URL` format
- Check database is accessible
- Verify credentials are correct
- Check network/firewall rules

### Frontend API Errors

Error: `Network request failed`
- Verify `VITE_API_URL` is set
- Check API URL is correct
- Ensure CORS is configured
- Verify backend is running

## Related Documentation

- [Deployment Overview](./overview.md) - Deployment guide
- [Security Checklist](./security.md) - Security configuration
- [Monitoring & Logging](./monitoring.md) - Monitoring setup

