import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductRateDto, UpdateProductRateDto } from '../dto';
import { ProductRateEntity } from '../entities';
import { ProductsService } from './products.service';
import { UsersService } from 'src/users/services';

@Injectable()
export class ProductRatesService {
  constructor(
    @InjectRepository(ProductRateEntity)
    private readonly productRatesRepository: Repository<ProductRateEntity>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async createProductRate(
    createProductRate: CreateProductRateDto,
    username: string,
  ): Promise<boolean> {
    const product = await this.productsService.findOneById(
      createProductRate.productId,
    );
    const user = await this.usersService.findOneByUsername(username);

    if (!product || !user) {
      throw new Error('Product or User not found');
    }

    await this.productRatesRepository.create({
      rating: createProductRate.rating,
      product: product,
      user: user,
    });

    return true;
  }

  async updateProductRate(
    updateProductRate: UpdateProductRateDto,
    username: string,
  ): Promise<boolean> {
    try {
      const productRate = await this.productRatesRepository.findOne({
        where: {
          product: { id: updateProductRate.productId },
          user: { username },
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
