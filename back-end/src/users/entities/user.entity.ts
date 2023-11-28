import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { RoleEntity } from './role.entity';
import { Transform } from 'class-transformer';

@Entity({ name: 'users' })
@Unique('constraint_name', ['username', 'email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Transform(({ value }) => value.name)
  @OneToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
