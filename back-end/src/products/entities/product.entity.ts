import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  createdDate: Date;

  @Column({ type: 'date' })
  updatedDate: Date;

  constructor(partial: Partial<Product>) {
    super();
    Object.assign(this, partial);
  }
}