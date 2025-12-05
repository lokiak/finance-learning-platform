// Type augmentation for Prisma Client
// This ensures TypeScript recognizes the 'role' field on User model
// This file is automatically included by TypeScript

import '@prisma/client';

declare module '@prisma/client' {
  namespace Prisma {
    // Extend UserCreateInput to include role
    interface UserCreateInput {
      role?: UserRole | EnumUserRoleFieldUpdateOperationsInput;
    }

    // Extend UserUncheckedCreateInput to include role
    interface UserUncheckedCreateInput {
      role?: UserRole;
    }

    // Extend UserUpdateInput to include role
    interface UserUpdateInput {
      role?: UserRole | EnumUserRoleFieldUpdateOperationsInput;
    }

    // Extend UserUncheckedUpdateInput to include role
    interface UserUncheckedUpdateInput {
      role?: UserRole;
    }

    // Extend UserSelect to include role
    interface UserSelect {
      role?: boolean;
    }
  }

  // Ensure User interface includes role
  interface User {
    role: UserRole;
  }
}
