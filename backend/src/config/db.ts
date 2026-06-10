import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Usuario } from '../entities/Usuario';
import { Proyecto } from '../entities/Proyecto';
import { Novedad } from '../entities/Novedad';
import { Comentario } from '../entities/Comentario';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Usuario, Proyecto, Novedad, Comentario],
  subscribers: [],
  migrations: [],
});
