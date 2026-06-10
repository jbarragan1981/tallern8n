import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { IncidenciaService } from '../services/incidencia.service';

export class IncidenciaController {
  private incidenciaService = new IncidenciaService();

  getStats = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.incidenciaService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const list = await this.incidenciaService.getAll();
      res.status(200).json(list);
    } catch (error) {
      next(error);
    }
  };

  updateEstado = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { estado, comentario } = req.body;
      const autorId = req.user!.id; // from authMiddleware

      const updated = await this.incidenciaService.updateEstado(id, estado, comentario, autorId);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  getProyectos = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const proyectos = await this.incidenciaService.getProyectos();
      res.status(200).json(proyectos);
    } catch (error) {
      next(error);
    }
  };
}
