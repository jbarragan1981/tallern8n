import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { authRateLimiter } from '../middlewares/rate-limit.middleware';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../dtos/auth.schema';

const router = Router();
const controller = new AuthController();

router.post('/register', validateBody(registerSchema), controller.register);
router.post('/login', authRateLimiter, validateBody(loginSchema), controller.login);
router.post('/forgot-password', authRateLimiter, validateBody(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), controller.resetPassword);

export default router;
