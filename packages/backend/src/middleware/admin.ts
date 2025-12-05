import { Response, NextFunction } from 'express';
import { ErrorCodes, ErrorMessages } from '@finance-platform/shared';
import { AppError } from './errorHandler';
import { AuthRequest } from './auth';
import { prisma } from '../index';

export const requireAdmin = async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    throw new AppError(
      ErrorCodes.AUTH_UNAUTHORIZED,
      ErrorMessages[ErrorCodes.AUTH_UNAUTHORIZED],
      401
    );
  }

  // Check role from database, not JWT token (JWT might be stale)
  const user = await (prisma.user as any).findUnique({
    where: { id: req.user.userId },
    select: { role: true },
  });

  const userRole = user?.role || req.user.role || 'user';

  if (userRole !== 'admin') {
    throw new AppError(
      'FORBIDDEN',
      'Admin access required',
      403
    );
  }

  next();
};

