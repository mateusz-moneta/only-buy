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

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @Column()
  isPromo: boolean;

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product)
  productsImages: ProductImageEntity[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  constructor(partial: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
