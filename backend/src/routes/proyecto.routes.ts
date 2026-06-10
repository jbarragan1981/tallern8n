import { Router } from 'express';
import { IncidenciaController } from '../controllers/incidencia.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const controller = new IncidenciaController();

router.use(authMiddleware as any);

router.get('/', controller.getProyectos);

export default router;
