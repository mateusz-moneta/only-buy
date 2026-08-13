import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductRateDto, UpdateProductRateDto } from '../../dto';
import { ProductRateEntity } from '../../entities';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../../../users/services';
import { ProductRate } from '../../models';

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
  ): Promise<ProductRate> {
    const product = await this.productsService.findOneById(
      createProductRate.productId,
    );

    const user = await this.usersService.findOneByUsername(username);

    if (!product || !user) {
      throw new NotFoundException('Product or user not found');
    }

    const existingRate = await this.productRatesRepository.findOne({
      where: {
        product: {
          id: product.id,
        },
        user: {
          id: user.id,
        },
      },
    });

    if (existingRate) {
      throw new ConflictException('You have already rated this product');
    }

    const productRateEntity = this.productRatesRepository.create({
      rating: createProductRate.rating,
      product,
      user,
    });

    await productRateEntity.save();

    const result = await this.productRatesRepository
      .createQueryBuilder('productRate')
      .select('ROUND(AVG(productRate.rating))', 'averageRating')
      .where('productRate.productId = :productId', {
        productId: product.id,
      })
      .getRawOne<{ averageRating: string }>();

    return {
      rating: productRateEntity.rating,
      averageRating: Number(result.averageRating),
    };
  }

  async updateProductRate(
    updateProductRate: UpdateProductRateDto,
    username: string,
  ): Promise<ProductRate> {
    const productRate = await this.productRatesRepository.findOne({
      where: {
        product: {
          id: updateProductRate.productId,
        },
        user: {
          username,
        },
      },
    });

    if (!productRate) {
      throw new NotFoundException('Product rate not found');
    }

    productRate.rating = updateProductRate.rating;

    await this.productRatesRepository.save(productRate);

    const result = await this.productRatesRepository
      .createQueryBuilder('productRate')
      .select('AVG(productRate.rating)', 'averageRating')
      .where('productRate.productId = :productId', {
        productId: updateProductRate.productId,
      })
      .getRawOne<{ averageRating: string }>();

    return {
      rating: productRate.rating,
      averageRating: Number(result.averageRating),
    };
  }
}
