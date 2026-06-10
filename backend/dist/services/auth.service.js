"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../config/db");
const Usuario_1 = require("../entities/Usuario");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("typeorm");
class AuthService {
    usuarioRepository = db_1.AppDataSource.getRepository(Usuario_1.Usuario);
    async register(nombre, email, password) {
        const existingUser = await this.usuarioRepository.findOneBy({ email });
        if (existingUser) {
            const err = new Error('El correo ya está registrado');
            err.status = 400;
            throw err;
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario_1.Usuario();
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
    async login(email, password) {
        const user = await this.usuarioRepository.findOne({
            where: { email },
            select: ['id', 'nombre', 'email', 'rol', 'activo', 'passwordHash', 'creadoEn', 'chatId'],
        });
        if (!user || !user.passwordHash) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }
        if (!user.activo) {
            const err = new Error('Usuario inactivo');
            err.status = 401;
            throw err;
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }
        const secret = process.env.JWT_SECRET || 'supersecretlongstringforjsonwebtokenurvaseoportal';
        const expires = process.env.JWT_EXPIRES || '2h';
        const token = jwt.sign({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, secret, { expiresIn: expires });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash: _, resetToken: __, resetExpira: ___, ...userWithoutSensitives } = user;
        return { token, user: userWithoutSensitives };
    }
    async forgotPassword(email) {
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
                await axios_1.default.post(webhookUrl, {
                    email: user.email,
                    reset_url: resetUrl,
                });
            }
            catch (err) {
                console.error('Error enviando webhook a n8n:', err.message);
                // No fallamos la petición para el usuario final, solo loggeamos el error del webhook
            }
        }
        else {
            console.warn('N8N_RESET_WEBHOOK no configurado en variables de entorno');
        }
        return { message: 'Si el correo está registrado, se enviará un enlace de recuperación' };
    }
    async resetPassword(token, password) {
        const user = await this.usuarioRepository.findOne({
            where: {
                resetToken: token,
                resetExpira: (0, typeorm_1.MoreThan)(new Date()),
            },
            select: ['id', 'nombre', 'email', 'rol', 'activo', 'passwordHash', 'resetToken', 'resetExpira'],
        });
        if (!user) {
            const err = new Error('Token inválido o expirado');
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
exports.AuthService = AuthService;
