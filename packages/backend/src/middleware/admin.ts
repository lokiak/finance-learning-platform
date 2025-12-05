import { Response, NextFunction } from 'express';
import { ErrorCodes, ErrorMessages } from '@finance-platform/shared';
import { AppError } from './errorHandler';
import { AuthRequest } from './auth';
import { prisma } from '../index';
import { getUserWithRole } from '../utils/prismaHelpers';

export const requireAdmin = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      return next(
        new AppError(
          ErrorCodes.AUTH_UNAUTHORIZED,
          ErrorMessages[ErrorCodes.AUTH_UNAUTHORIZED],
          401
        )
      );
    }

    // Check role from database, not JWT token (JWT might be stale)
    const user = await getUserWithRole(prisma, req.user.userId);
    const userRole = user?.role || req.user.role || 'user';

    if (userRole !== 'admin') {
      return next(
        new AppError(
          'FORBIDDEN',
          'Admin access required',
          403
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

