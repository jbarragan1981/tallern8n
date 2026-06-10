import { AppDataSource } from '../config/db';
import { Novedad } from '../entities/Novedad';
import { Comentario } from '../entities/Comentario';
import { Proyecto } from '../entities/Proyecto';

export class IncidenciaService {
  private novedadRepository = AppDataSource.getRepository(Novedad);
  private comentarioRepository = AppDataSource.getRepository(Comentario);
  private proyectoRepository = AppDataSource.getRepository(Proyecto);

  async getStats(): Promise<{
    total: number;
    estados: { estado: string; count: number }[];
    severidades: { severidad: string; count: number }[];
    proyectos: { proyecto: string; count: number }[];
  }> {
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

  async getAll(): Promise<Novedad[]> {
    return await this.novedadRepository.find({
      relations: ['proyecto', 'reportadoPor', 'asignadoA'],
      order: { creadoEn: 'DESC' },
    });
  }

  async updateEstado(id: string, nuevoEstado: 'abierto' | 'en_progreso' | 'resuelto', comentarioText: string, autorId: string): Promise<Novedad> {
    const novedad = await this.novedadRepository.findOneBy({ id });
    if (!novedad) {
      const err: any = new Error('Incidencia no encontrada');
      err.status = 404;
      throw err;
    }

    novedad.estado = nuevoEstado;
    novedad.actualizadoEn = new Date();
    const updatedNovedad = await this.novedadRepository.save(novedad);

    const comentario = new Comentario();
    comentario.novedadId = id;
    comentario.autorId = autorId;
    comentario.comentario = comentarioText;
    comentario.estadoNuevo = nuevoEstado;
    await this.comentarioRepository.save(comentario);

    return updatedNovedad;
  }

  async getProyectos(): Promise<Proyecto[]> {
    return await this.proyectoRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }
}
