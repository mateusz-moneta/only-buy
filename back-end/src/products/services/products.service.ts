import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from '../dto';
import { ProductEntity } from '../entities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  findAll(): Promise<ProductEntity[]> {
    return this.productsRepository.find();
  }

  findOneById(id: string): Promise<ProductEntity | null> {
    return this.productsRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
