import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import incidenciaRoutes from './routes/incidencia.routes';
import proyectoRoutes from './routes/proyecto.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/incidencias', incidenciaRoutes);
app.use('/api/proyectos', proyectoRoutes);

// Error middleware
app.use(errorHandler);

export default app;
