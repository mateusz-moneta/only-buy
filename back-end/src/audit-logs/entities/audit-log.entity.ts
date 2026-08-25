import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities';
import { AuditAction, AuditEntity } from '../enums';

@Entity({ name: 'audit_logs' })
@Index(['entity', 'entityId'])
export class AuditLogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntity,
  })
  entity: AuditEntity;

  @Column({ type: 'uuid' })
  entityId: string;

  @Index()
  @ManyToOne(() => UserEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity | null;

  @Column({ type: 'uuid', nullable: true })
  userId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  oldValue: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  newValue: Record<string, unknown> | null;

  @CreateDateColumn()
  createdDate: Date;

  constructor(partial: Partial<AuditLogEntity>) {
    super();
    Object.assign(this, partial);
  }
}
