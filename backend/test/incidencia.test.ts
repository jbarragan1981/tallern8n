import request from 'supertest';
import app from '../src/app';
import * as jwt from 'jsonwebtoken';

jest.mock('../src/config/db', () => {
  const m = {
    count: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  (global as any).mockIncidenciaRepo = m;
  return {
    AppDataSource: {
      getRepository: () => m,
    },
  };
});

const mockRepo = (global as any).mockIncidenciaRepo;

const testToken = jwt.sign(
  { id: '1', nombre: 'Juan Perez', email: 'juan@test.com', rol: 'reportante' },
  'testsecretkeytestsecretkeytestsecretkey'
);

describe('Incidencia Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/incidencias/stats', () => {
    it('should return aggregated stats', async () => {
      mockRepo.count.mockResolvedValue(10);
      
      const createQueryBuilderMock = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        getRawMany: jest.fn()
          .mockResolvedValueOnce([{ estado: 'abierto', count: '5' }])
          .mockResolvedValueOnce([{ severidad: 'Alta', count: '3' }])
          .mockResolvedValueOnce([{ proyecto: 'Proyecto Alfa', count: '4' }]),
      };
      
      mockRepo.createQueryBuilder.mockReturnValue(createQueryBuilderMock);

      const res = await request(app)
        .get('/api/incidencias/stats')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(10);
      expect(res.body.estados).toEqual([{ estado: 'abierto', count: 5 }]);
    });
  });

  describe('GET /api/incidencias', () => {
    it('should return all incidences', async () => {
      mockRepo.find.mockResolvedValue([
        { id: '1', titulo: 'Problema de red', estado: 'abierto' }
      ]);

      const res = await request(app)
        .get('/api/incidencias')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(200);
      expect(res.body[0].titulo).toBe('Problema de red');
    });
  });

  describe('PATCH /api/incidencias/:id/estado', () => {
    it('should update status and create comment', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: '1', estado: 'abierto' });
      mockRepo.save.mockImplementation(async (entity: any) => entity);

      const res = await request(app)
        .patch('/api/incidencias/1/estado')
        .set('Authorization', `Bearer ${testToken}`)
        .send({ estado: 'en_progreso', comentario: 'Trabajando en el asunto' });

      expect(res.status).toBe(200);
      expect(res.body.estado).toBe('en_progreso');
    });
  });

  describe('GET /api/proyectos', () => {
    it('should return active projects', async () => {
      mockRepo.find.mockResolvedValue([
        { id: '1', nombre: 'Proyecto A', activo: true }
      ]);

      const res = await request(app)
        .get('/api/proyectos')
        .set('Authorization', `Bearer ${testToken}`);

      expect(res.status).toBe(200);
      expect(res.body[0].nombre).toBe('Proyecto A');
    });
  });
});
