import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Log error message safely
  console.error(`[Error] Status: ${status} - Message: ${message}`);

  res.status(status).json({ message });
};
