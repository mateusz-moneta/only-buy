import {
  BaseEntity,
  Check,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { UserEntity } from '../../users/entities';

@Entity({ name: 'products_rates' })
@Unique(['product', 'user'])
@Check(`"rating" BETWEEN 1 AND 5`)
export class ProductRateEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  rating: number;

  @Index()
  @ManyToOne(() => ProductEntity, (product) => product.rates, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @Index()
  @ManyToOne(() => UserEntity, (user) => user.rates)
  user: UserEntity;

  constructor(partial: Partial<ProductRateEntity>) {
    super();
    Object.assign(this, partial);
  }
}
