"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEstadoSchema = void 0;
const zod_1 = require("zod");
exports.updateEstadoSchema = zod_1.z.object({
    estado: zod_1.z.enum(['abierto', 'en_progreso', 'resuelto'], {
        errorMap: () => ({ message: 'Estado debe ser abierto, en_progreso o resuelto' }),
    }),
    comentario: zod_1.z.string().min(5, 'El comentario/justificación debe tener al menos 5 caracteres'),
});
