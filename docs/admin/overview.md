# Admin Console Overview

Administrative interface for monitoring and managing the Finance Learning Platform.

## Access

The admin console is accessible at `/admin` route and requires:
1. User authentication (valid JWT token)
2. Admin role (`role: 'admin'`)

## Features

### Analytics Dashboard

Comprehensive analytics including:
- User engagement metrics
- Learning performance data
- Prediction accuracy tracking
- Adaptation effectiveness
- Support utilization rates
- Reflection process usage

See [Analytics Dashboard](./analytics.md) for details.

### User Management

- View user statistics
- Monitor user activity
- Track user progress
- Analyze user behavior patterns

See [User Management](./user-management.md) for details.

### System Monitoring

- Application health
- Database performance
- API response times
- Error rates

See [System Monitoring](./monitoring.md) for details.

## Making a User Admin

### Using Database Query

```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### Using Prisma Studio

1. Open Prisma Studio: `docker-compose exec backend npx prisma studio`
2. Navigate to User model
3. Find user by email
4. Change `role` field to `admin`
5. Save changes

### Using Script (if available)

```bash
docker-compose exec backend npx ts-node scripts/make-admin.ts user@example.com
```

## Admin Routes

All admin routes are prefixed with `/api/admin`:

- `GET /api/admin/analytics` - Complete analytics
- `GET /api/admin/analytics/overview` - Overview metrics
- `GET /api/admin/analytics/predictions` - Prediction metrics
- `GET /api/admin/analytics/adaptations` - Adaptation metrics
- `GET /api/admin/analytics/support` - Support metrics
- `GET /api/admin/analytics/engagement` - Engagement metrics
- `GET /api/admin/analytics/reflection` - Reflection metrics
- `GET /api/admin/analytics/performance` - Performance metrics

See [API Documentation](../api/admin.md) for complete API reference.

## Frontend Access

The admin dashboard is available at:
- Route: `/admin`
- Component: `AdminDashboard.tsx`
- Protected by: `AdminRoute` component

Admin link appears in sidebar navigation for admin users only.

## Security

- All admin endpoints require authentication
- Role checked on every request (database lookup)
- JWT tokens don't need regeneration after role change
- ETag caching respects role changes

## Best Practices

1. **Limit Admin Users**: Only grant admin role to trusted users
2. **Monitor Access**: Review admin access logs regularly
3. **Secure Credentials**: Use strong passwords for admin accounts
4. **Regular Audits**: Review admin actions periodically
5. **Backup Data**: Regular backups before major changes

## Troubleshooting

### Admin Link Not Visible

1. Verify user role is `admin` in database
2. Check JWT token includes role (may need re-login)
3. Verify ETag cache invalidation
4. Check browser cache

### Access Denied (403)

1. Verify user role in database
2. Check `requireAdmin` middleware
3. Ensure JWT token is valid
4. Try logging out and back in

### Analytics Not Loading

1. Check database connectivity
2. Verify Prisma Client is generated
3. Check for database migration issues
4. Review error logs

## Related Documentation

- [API Documentation](../api/admin.md) - Admin API endpoints
- [Analytics Dashboard](./analytics.md) - Analytics details
- [User Management](./user-management.md) - User management
- [System Monitoring](./monitoring.md) - Monitoring setup

