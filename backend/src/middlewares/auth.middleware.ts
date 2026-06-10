import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    nombre: string;
    email: string;
    rol: 'reportante' | 'tecnico' | 'supervisor';
  };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No se proporcionó un token de autenticación válido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'supersecretlongstringforjsonwebtokenurvaseoportal';
    const decoded = jwt.verify(token, secret) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token de autenticación inválido o expirado' });
  }
};

export const requireRole = (allowedRoles: ('reportante' | 'tecnico' | 'supervisor')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.rol)) {
      res.status(403).json({ message: 'Acceso prohibido para su rol de usuario' });
      return;
    }

    next();
  };
};
