import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'bot_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ type: 'bigint', name: 'chat_id', nullable: true, unique: true })
  chatId?: string | null;

  @Column({ type: 'varchar', length: 120 })
  nombre!: string;

  @Column({ type: 'varchar', length: 20, default: 'reportante' })
  rol!: 'reportante' | 'tecnico' | 'supervisor';

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'creado_en', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn!: Date;

  @Column({ type: 'varchar', length: 150, nullable: true, unique: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 255, name: 'password_hash', nullable: true, select: false })
  passwordHash?: string | null;

  @Column({ type: 'varchar', length: 255, name: 'reset_token', nullable: true, select: false })
  resetToken?: string | null;

  @Column({ type: 'timestamp', name: 'reset_expira', nullable: true, select: false })
  resetExpira?: Date | null;
}
