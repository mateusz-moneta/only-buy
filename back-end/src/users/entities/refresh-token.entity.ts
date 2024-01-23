import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @OneToOne(() => UserEntity, (user) => user.refreshToken)
  @JoinColumn({ name: 'id' })
  user: UserEntity;
}
