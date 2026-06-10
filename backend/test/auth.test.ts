import request from 'supertest';
import app from '../src/app';
import * as bcrypt from 'bcryptjs';

jest.mock('../src/config/db', () => {
  const m = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };
  (global as any).mockAuthRepo = m;
  return {
    AppDataSource: {
      getRepository: () => m,
    },
  };
});

const mockRepo = (global as any).mockAuthRepo;

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      mockRepo.save.mockResolvedValue({
        id: '1',
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        rol: 'reportante',
        activo: true,
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ nombre: 'Juan Perez', email: 'juan@test.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe('juan@test.com');
      expect(res.body.rol).toBe('reportante');
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('should return 400 if email already exists', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: '1', email: 'juan@test.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ nombre: 'Juan Perez', email: 'juan@test.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('El correo ya está registrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      const hash = await bcrypt.hash('password123', 10);
      mockRepo.findOne.mockResolvedValue({
        id: '1',
        nombre: 'Juan Perez',
        email: 'juan@test.com',
        rol: 'reportante',
        activo: true,
        passwordHash: hash,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'juan@test.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('juan@test.com');
    });

    it('should return 401 for invalid credentials', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'juan@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should return 200 regardless of email existence', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: '1', email: 'juan@test.com' });
      mockRepo.save.mockResolvedValue({});

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'juan@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('recuperación');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password successfully with valid token', async () => {
      mockRepo.findOne.mockResolvedValue({
        id: '1',
        email: 'juan@test.com',
        resetToken: 'token123',
        resetExpira: new Date(Date.now() + 10000),
      });
      mockRepo.save.mockResolvedValue({});

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'token123', password: 'newpassword123' });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Contraseña actualizada');
    });

    it('should fail reset with invalid/expired token', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'wrongtoken', password: 'newpassword123' });

      expect(res.status).toBe(400);
    });
  });
});
