import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorCodes, ErrorMessages } from '@finance-platform/shared';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        ErrorCodes.AUTH_UNAUTHORIZED,
        ErrorMessages[ErrorCodes.AUTH_UNAUTHORIZED],
        401
      );
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(
        new AppError(
          ErrorCodes.AUTH_TOKEN_INVALID,
          ErrorMessages[ErrorCodes.AUTH_TOKEN_INVALID],
          401
        )
      );
    } else if (error instanceof jwt.TokenExpiredError) {
      next(
        new AppError(
          ErrorCodes.AUTH_TOKEN_EXPIRED,
          ErrorMessages[ErrorCodes.AUTH_TOKEN_EXPIRED],
          401
        )
      );
    } else {
      next(error);
    }
  }
};
