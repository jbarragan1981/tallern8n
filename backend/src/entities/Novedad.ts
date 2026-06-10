import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Proyecto } from './Proyecto';
import { Usuario } from './Usuario';

@Entity({ name: 'novedades' })
export class Novedad {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  tipo!: 'desarrollo' | 'novedad';

  @Column({ type: 'bigint', name: 'proyecto_id', nullable: true })
  proyectoId?: string | null;

  @ManyToOne(() => Proyecto)
  @JoinColumn({ name: 'proyecto_id' })
  proyecto?: Proyecto | null;

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string | null;

  @Column({ type: 'varchar', length: 10, default: 'Media' })
  severidad!: 'Alta' | 'Media' | 'Baja';

  @Column({ type: 'varchar', length: 15, default: 'abierto' })
  estado!: 'abierto' | 'en_progreso' | 'resuelto';

  @Column({ type: 'bigint', name: 'reportado_por', nullable: true })
  reportadoPorId?: string | null;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'reportado_por' })
  reportadoPor?: Usuario | null;

  @Column({ type: 'bigint', name: 'asignado_a', nullable: true })
  asignadoAId?: string | null;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'asignado_a' })
  asignadoA?: Usuario | null;

  @Column({ type: 'text', name: 'adjunto_url', nullable: true })
  adjuntoUrl?: string | null;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actualizadoEn!: Date;
}
