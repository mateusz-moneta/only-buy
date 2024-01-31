import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductRateEntity } from '../entities';
import { CreateProductRateDto, UpdateProductRateDto } from '../dto';

@Injectable()
export class ProductRatesService {
  constructor(
    @InjectRepository(ProductRateEntity)
    private readonly productRatesRepository: Repository<ProductRateEntity>,
  ) {}

  async createProductRate(
    createProductRate: CreateProductRateDto,
  ): Promise<ProductRateEntity> {
    const productRate: ProductRateEntity = this.productRatesRepository.create({
      rating: createProductRate.rating,
      product: { id: createProductRate.productId },
      user: { id: createProductRate.userId },
    });

    return this.productRatesRepository.save(productRate);
  }

  async updateProductRate(
    updateProductRate: UpdateProductRateDto,
  ): Promise<boolean> {
    try {
      const productRate = await this.productRatesRepository.findOne({
        where: {
          product: { id: updateProductRate.productId },
          user: { id: updateProductRate.userId },
        },
      });
      await this.productRatesRepository.update(productRate.id, {
        rating: updateProductRate.rating,
      });

      return true;
    } catch (exception) {
      return false;
    }
  }
}
