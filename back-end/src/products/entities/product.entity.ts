import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamptz' })
  createdDate: Date;

  @Column({ type: 'timestamptz' })
  updatedDate: Date;

  constructor(partial: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
