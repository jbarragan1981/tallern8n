import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Novedad } from './Novedad';
import { Usuario } from './Usuario';

@Entity({ name: 'comentarios' })
export class Comentario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint', name: 'novedad_id' })
  novedadId!: string;

  @ManyToOne(() => Novedad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'novedad_id' })
  novedad!: Novedad;

  @Column({ type: 'bigint', name: 'autor_id', nullable: true })
  autorId?: string | null;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'autor_id' })
  autor?: Usuario | null;

  @Column({ type: 'text' })
  comentario!: string;

  @Column({ type: 'varchar', length: 15, name: 'estado_nuevo', nullable: true })
  estadoNuevo?: 'abierto' | 'en_progreso' | 'resuelto' | null;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn!: Date;
}
