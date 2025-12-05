# Prisma Helpers

Type-safe helper functions for Prisma operations that have TypeScript type issues.

## Overview

The `prismaHelpers.ts` module provides centralized, type-safe functions for Prisma operations where Prisma Client's generated types may not fully recognize certain fields (like `role` on the User model).

**Location**: `packages/backend/src/utils/prismaHelpers.ts`

## Why Prisma Helpers?

Prisma Client's generated types sometimes don't immediately recognize newly added fields, even after regeneration. Rather than scattering `as any` type assertions throughout the codebase, we centralize type handling in helper functions.

**Benefits:**
- ✅ Centralized type handling
- ✅ Type-safe function signatures
- ✅ Easy to maintain and update
- ✅ Clean codebase without scattered type assertions
- ✅ Scalable pattern for future type issues

## Available Helpers

### createUserWithRole

Create a user with role field.

```typescript
import { createUserWithRole } from '../utils/prismaHelpers';
import { UserRole } from '@finance-platform/shared';

await createUserWithRole(prisma, {
  email: 'user@example.com',
  password_hash: hashedPassword,
  name: 'John Doe',
  role: 'admin' as UserRole,
});
```

**Parameters:**
- `prisma`: PrismaClient instance
- `data`: User creation data with role field

**Returns:** Promise<User>

### getUserWithRole

Get user with role field selected.

```typescript
import { getUserWithRole } from '../utils/prismaHelpers';

const user = await getUserWithRole(prisma, userId);
if (user?.role === 'admin') {
  // Admin logic
}
```

**Parameters:**
- `prisma`: PrismaClient instance
- `userId`: User UUID

**Returns:** Promise<{ role: UserRole } | null>

### updateUserRole

Update a user's role.

```typescript
import { updateUserRole } from '../utils/prismaHelpers';

await updateUserRole(prisma, userId, 'admin');
```

**Parameters:**
- `prisma`: PrismaClient instance
- `userId`: User UUID
- `role`: New role value

**Returns:** Promise<User>

## Usage Examples

### In Middleware

```typescript
// packages/backend/src/middleware/admin.ts
import { getUserWithRole } from '../utils/prismaHelpers';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await getUserWithRole(prisma, req.user.userId);
  const userRole = user?.role || req.user.role || 'user';

  if (userRole !== 'admin') {
    return next(new AppError('FORBIDDEN', 'Admin access required', 403));
  }

  next();
};
```

### In Tests

```typescript
// packages/backend/src/__tests__/integration/admin.test.ts
import { createUserWithRole } from '../../utils/prismaHelpers';

beforeAll(async () => {
  const adminPasswordHash = await bcrypt.hash('password', 10);
  await createUserWithRole(prisma, {
    email: 'admin@test.com',
    password_hash: adminPasswordHash,
    name: 'Test Admin',
    role: 'admin',
  });
});
```

### In Services

```typescript
// Example service usage
import { getUserWithRole, updateUserRole } from '../utils/prismaHelpers';

export class UserService {
  static async promoteToAdmin(userId: string) {
    const user = await getUserWithRole(prisma, userId);
    if (!user) {
      throw new Error('User not found');
    }

    return updateUserRole(prisma, userId, 'admin');
  }
}
```

## Adding New Helpers

When you encounter Prisma type issues, add a helper function:

```typescript
// In prismaHelpers.ts

/**
 * Type-safe helper for [description]
 */
export async function yourHelperFunction(
  prisma: PrismaClient,
  // ... parameters
): Promise<ReturnType> {
  // Use type assertion only here, centralized
  return (prisma.model as any).operation({
    // ... operation config
  });
}
```

**Guidelines:**
1. Use descriptive function names
2. Add JSDoc comments
3. Keep type assertions inside the helper
4. Export proper TypeScript types
5. Add usage examples in comments

## Type Safety

Helpers use `UserRole` from `@finance-platform/shared` for consistency:

```typescript
import { UserRole } from '@finance-platform/shared';
```

This ensures type consistency across the codebase.

## Migration Path

If Prisma Client types are eventually fixed:

1. Update helper functions to use direct Prisma calls
2. Remove type assertions
3. Update all call sites
4. Remove helpers if no longer needed

## Best Practices

1. **Always use helpers** for operations involving fields with type issues
2. **Don't add `as any`** elsewhere in the codebase
3. **Document new helpers** with JSDoc comments
4. **Keep helpers focused** - one responsibility per function
5. **Test helpers** in integration tests

## Related Documentation

- [Type System](./type-system.md) - Overall type system architecture
- [Database Schema](./database-schema.md) - Database structure
- [Testing](./testing/) - Testing with Prisma helpers

