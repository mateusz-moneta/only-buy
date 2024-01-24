import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductImageDto } from '../dto';
import { ProductImageEntity } from '../entities';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImageEntity)
    private readonly productImagesRepository: Repository<ProductImageEntity>,
  ) {}

  async createProductImage(
    createProductImage: CreateProductImageDto,
  ): Promise<ProductImageEntity> {
    const productImage =
      this.productImagesRepository.create(createProductImage);

    return this.productImagesRepository.save(productImage);
  }

  findAll(): Promise<ProductImageEntity[]> {
    return this.productImagesRepository.find();
  }

  findOneById(id: string): Promise<ProductImageEntity | null> {
    return this.productImagesRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.productImagesRepository.delete(id);
  }
}
