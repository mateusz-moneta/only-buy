import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductEntity } from './product.entity';
import { UserEntity } from '../../users/entities';

@Entity({ name: 'products_rates' })
export class ProductRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  rating: number;

  @ManyToOne(() => ProductEntity, (product) => product.productRates)
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user) => user.productRates)
  user: UserEntity;

  constructor(partial: Partial<ProductRateEntity>) {
    super();
    Object.assign(this, partial);
  }
}
