import { z } from 'zod';

export const updateEstadoSchema = z.object({
  estado: z.enum(['abierto', 'en_progreso', 'resuelto'], {
    errorMap: () => ({ message: 'Estado debe ser abierto, en_progreso o resuelto' }),
  }),
  comentario: z.string().min(5, 'El comentario/justificación debe tener al menos 5 caracteres'),
});
