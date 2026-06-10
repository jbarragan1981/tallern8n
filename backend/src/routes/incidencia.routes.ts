import { Router } from 'express';
import { IncidenciaController } from '../controllers/incidencia.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validation.middleware';
import { updateEstadoSchema } from '../dtos/incidencia.schema';

const router = Router();
const controller = new IncidenciaController();

router.use(authMiddleware as any);

router.get('/stats', controller.getStats);
router.get('/', controller.getAll);
router.patch('/:id/estado', validateBody(updateEstadoSchema), controller.updateEstado);

export default router;
