import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ErrorCodes } from '@finance-platform/shared';
import { AppError } from './errorHandler';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      next(
        new AppError(
          ErrorCodes.VALIDATION_ERROR,
          'Validation failed',
          400,
          error
        )
      );
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error) {
      next(
        new AppError(
          ErrorCodes.VALIDATION_ERROR,
          'Invalid parameters',
          400,
          error
        )
      );
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      next(
        new AppError(
          ErrorCodes.VALIDATION_ERROR,
          'Invalid query parameters',
          400,
          error
        )
      );
    }
  };
};
