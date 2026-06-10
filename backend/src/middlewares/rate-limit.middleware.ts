import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // limitamos a 15 intentos por IP por ventana
  message: { message: 'Demasiadas solicitudes desde esta IP, intente de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
