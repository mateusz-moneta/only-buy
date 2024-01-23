import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RoleEntity } from './role.entity';

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
  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedDate: Date;

  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshToken: RefreshTokenEntity;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
