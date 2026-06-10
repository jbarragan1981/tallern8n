"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidenciaController = void 0;
const incidencia_service_1 = require("../services/incidencia.service");
class IncidenciaController {
    incidenciaService = new incidencia_service_1.IncidenciaService();
    getStats = async (_req, res, next) => {
        try {
            const stats = await this.incidenciaService.getStats();
            res.status(200).json(stats);
        }
        catch (error) {
            next(error);
        }
    };
    getAll = async (_req, res, next) => {
        try {
            const list = await this.incidenciaService.getAll();
            res.status(200).json(list);
        }
        catch (error) {
            next(error);
        }
    };
    updateEstado = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { estado, comentario } = req.body;
            const autorId = req.user.id; // from authMiddleware
            const updated = await this.incidenciaService.updateEstado(id, estado, comentario, autorId);
            res.status(200).json(updated);
        }
        catch (error) {
            next(error);
        }
    };
    getProyectos = async (_req, res, next) => {
        try {
            const proyectos = await this.incidenciaService.getProyectos();
            res.status(200).json(proyectos);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.IncidenciaController = IncidenciaController;
