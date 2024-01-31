import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImageEntity } from './product-image.entity';
import { ProductRateEntity } from './product-rate.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  code: string;

  @Column()
  isActive: boolean;

  @Column()
  isPromo: boolean;

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product)
  productsImages: ProductImageEntity[];

  @OneToMany(() => ProductRateEntity, (productRate) => productRate.product)
  productRates: ProductRateEntity[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(partial: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
