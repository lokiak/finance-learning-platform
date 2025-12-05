/**
 * Prisma Helper Functions
 *
 * These helpers provide type-safe access to Prisma operations that may have
 * type issues with Prisma Client's generated types. This is a clean, scalable
 * solution that centralizes type handling.
 */

import { PrismaClient } from '@prisma/client';
import { UserRole } from '@finance-platform/shared';

/**
 * Type-safe user creation with role field
 */
export async function createUserWithRole(
  prisma: PrismaClient,
  data: {
    email: string;
    password_hash: string;
    name: string;
    role: UserRole;
  }
) {
  // Use type assertion only here, centralized
  return (prisma.user as any).create({
    data,
  });
}

/**
 * Type-safe user query with role field selection
 */
export async function getUserWithRole(
  prisma: PrismaClient,
  userId: string
): Promise<{ role: UserRole } | null> {
  // Use type assertion only here, centralized
  const user = await (prisma.user as any).findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user;
}

/**
 * Type-safe user update with role field
 */
export async function updateUserRole(
  prisma: PrismaClient,
  userId: string,
  role: UserRole
) {
  // Use type assertion only here, centralized
  return (prisma.user as any).update({
    where: { id: userId },
    data: { role },
  });
}

