import { Request, Response, NextFunction } from 'express';
import { Schema, ZodError } from 'zod';

export const validateBody = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: error.errors[0]?.message || 'Datos de entrada inválidos',
          errors: error.errors,
        });
        return;
      }
      next(error);
    }
  };
};
