import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ProductEntity } from './product.entity';

@Entity({ name: 'products_images' })
export class ProductImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  file: string;

  @CreateDateColumn()
  uploadedDate: Date;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.productsImages,
  )
  product: ProductEntity;

  constructor(partial: Partial<ProductImageEntity>) {
    super();
    Object.assign(this, partial);
  }
}
