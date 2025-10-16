import { Request, Response, NextFunction } from 'express';
import { ErrorCodes, ErrorMessages } from '@finance-platform/shared';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.details : undefined,
      },
    });
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      res.status(409).json({
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'A record with this value already exists',
        },
      });
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        error: {
          code: ErrorCodes.RESOURCE_NOT_FOUND,
          message: 'Resource not found',
        },
      });
      return;
    }
  }

  // Handle validation errors
  if (err.name === 'ZodError') {
    res.status(400).json({
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Validation failed',
        details: process.env.NODE_ENV === 'development' ? (err as any).errors : undefined,
      },
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages[ErrorCodes.INTERNAL_SERVER_ERROR],
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
};

// Async handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
