import { AppDataSource } from '../config/db';
import { Usuario } from '../entities/Usuario';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import axios from 'axios';
import { MoreThan } from 'typeorm';

export class AuthService {
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  async register(nombre: string, email: string, password: md5OrPlain): Promise<Omit<Usuario, 'passwordHash' | 'resetToken' | 'resetExpira'>> {
    const existingUser = await this.usuarioRepository.findOneBy({ email });
    if (existingUser) {
      const err: any = new Error('El correo ya está registrado');
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const nuevoUsuario = new Usuario();
    nuevoUsuario.nombre = nombre;
    nuevoUsuario.email = email;
    nuevoUsuario.passwordHash = passwordHash;
    nuevoUsuario.rol = 'reportante';
    nuevoUsuario.activo = true;

    const savedUser = await this.usuarioRepository.save(nuevoUsuario);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, resetToken: __, resetExpira: ___, ...userWithoutSensitives } = savedUser;
    return userWithoutSensitives;
  }

  async login(email: string, password: string): Promise<{ token: string; user: Omit<Usuario, 'passwordHash' | 'resetToken' | 'resetExpira'> }> {
    const user = await this.usuarioRepository.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'rol', 'activo', 'passwordHash', 'creadoEn', 'chatId'],
    });

    if (!user || !user.passwordHash) {
      const err: any = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    if (!user.activo) {
      const err: any = new Error('Usuario inactivo');
      err.status = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err: any = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET || 'supersecretlongstringforjsonwebtokenurvaseoportal';
    const expires = process.env.JWT_EXPIRES || '2h';

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      secret,
      { expiresIn: expires as any }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, resetToken: __, resetExpira: ___, ...userWithoutSensitives } = user;
    return { token, user: userWithoutSensitives };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usuarioRepository.findOneBy({ email });
    
    // Si no existe, devolvemos éxito para evitar enumeración de cuentas
    if (!user) {
      return { message: 'Si el correo está registrado, se enviará un enlace de recuperación' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    user.resetToken = token;
    user.resetExpira = expira;
    await this.usuarioRepository.save(user);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset?token=${token}`;
    
    const webhookUrl = process.env.N8N_RESET_WEBHOOK;
    if (webhookUrl) {
      try {
        await axios.post(webhookUrl, {
          email: user.email,
          reset_url: resetUrl,
        });
      } catch (err) {
        console.error('Error enviando webhook a n8n:', (err as Error).message);
        // No fallamos la petición para el usuario final, solo loggeamos el error del webhook
      }
    } else {
      console.warn('N8N_RESET_WEBHOOK no configurado en variables de entorno');
    }

    return { message: 'Si el correo está registrado, se enviará un enlace de recuperación' };
  }

  async resetPassword(token: string, password: md5OrPlain): Promise<{ message: string }> {
    const user = await this.usuarioRepository.findOne({
      where: {
        resetToken: token,
        resetExpira: MoreThan(new Date()),
      },
      select: ['id', 'nombre', 'email', 'rol', 'activo', 'passwordHash', 'resetToken', 'resetExpira'],
    });

    if (!user) {
      const err: any = new Error('Token inválido o expirado');
      err.status = 400;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.resetToken = null;
    user.resetExpira = null;

    await this.usuarioRepository.save(user);

    return { message: 'Contraseña actualizada con éxito' };
  }
}

type md5OrPlain = string;
