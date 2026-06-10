import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'proyectos' })
export class Proyecto {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  nombre!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;
}
