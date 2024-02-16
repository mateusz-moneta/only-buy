import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RoleEntity } from '../../roles/entities';
import { ProductRateEntity } from '../../products/entities';

@Entity({ name: 'users' })
@Unique('constraint_name', ['username', 'email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @OneToMany(() => ProductRateEntity, (productRate) => productRate.user)
  rates: ProductRateEntity[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToOne(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshToken: RefreshTokenEntity;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
