"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidenciaService = void 0;
const db_1 = require("../config/db");
const Novedad_1 = require("../entities/Novedad");
const Comentario_1 = require("../entities/Comentario");
const Proyecto_1 = require("../entities/Proyecto");
class IncidenciaService {
    novedadRepository = db_1.AppDataSource.getRepository(Novedad_1.Novedad);
    comentarioRepository = db_1.AppDataSource.getRepository(Comentario_1.Comentario);
    proyectoRepository = db_1.AppDataSource.getRepository(Proyecto_1.Proyecto);
    async getStats() {
        const total = await this.novedadRepository.count();
        const estadosRaw = await this.novedadRepository
            .createQueryBuilder('n')
            .select('n.estado', 'estado')
            .addSelect('COUNT(*)', 'count')
            .groupBy('n.estado')
            .getRawMany();
        const severidadesRaw = await this.novedadRepository
            .createQueryBuilder('n')
            .select('n.severidad', 'severidad')
            .addSelect('COUNT(*)', 'count')
            .groupBy('n.severidad')
            .getRawMany();
        const proyectosRaw = await this.novedadRepository
            .createQueryBuilder('n')
            .leftJoin('n.proyecto', 'p')
            .select('COALESCE(p.nombre, \'Sin Proyecto\')', 'proyecto')
            .addSelect('COUNT(*)', 'count')
            .groupBy('p.nombre')
            .getRawMany();
        return {
            total,
            estados: estadosRaw.map(row => ({ estado: row.estado, count: parseInt(row.count, 10) })),
            severidades: severidadesRaw.map(row => ({ severidad: row.severidad, count: parseInt(row.count, 10) })),
            proyectos: proyectosRaw.map(row => ({ proyecto: row.proyecto, count: parseInt(row.count, 10) })),
        };
    }
    async getAll() {
        return await this.novedadRepository.find({
            relations: ['proyecto', 'reportadoPor', 'asignadoA'],
            order: { creadoEn: 'DESC' },
        });
    }
    async updateEstado(id, nuevoEstado, comentarioText, autorId) {
        const novedad = await this.novedadRepository.findOneBy({ id });
        if (!novedad) {
            const err = new Error('Incidencia no encontrada');
            err.status = 404;
            throw err;
        }
        novedad.estado = nuevoEstado;
        novedad.actualizadoEn = new Date();
        const updatedNovedad = await this.novedadRepository.save(novedad);
        const comentario = new Comentario_1.Comentario();
        comentario.novedadId = id;
        comentario.autorId = autorId;
        comentario.comentario = comentarioText;
        comentario.estadoNuevo = nuevoEstado;
        await this.comentarioRepository.save(comentario);
        return updatedNovedad;
    }
    async getProyectos() {
        return await this.proyectoRepository.find({
            where: { activo: true },
            order: { nombre: 'ASC' },
        });
    }
}
exports.IncidenciaService = IncidenciaService;
