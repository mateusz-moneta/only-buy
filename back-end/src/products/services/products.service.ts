import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from '../dto';
import { ProductEntity } from '../entities';
import { UploadService } from '../../uploads/services';
import { ProductImagesService } from './product-images.service';
import { Product } from '../models';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    private readonly productImagesService: ProductImagesService,
    private readonly uploadService: UploadService,
  ) {}

  async createProduct(
    createProduct: CreateProductDto,
    productImages: Express.Multer.File[],
  ): Promise<ProductEntity> {
    const product = new ProductEntity({
      name: createProduct.name,
      description: createProduct.description,
      price: parseFloat(createProduct.price),
      code: createProduct.code,
      isActive: createProduct.isActive === 'true',
      isPromo: createProduct.isPromo === 'true',
    });

    const savedProduct = await this.productsRepository.save(product);

    if (productImages?.length) {
      await Promise.all(
        productImages.map(async (productImage) => {
          const filePath = this.uploadService.saveFile(
            productImage,
            `product-images/${savedProduct.id}`,
          );

          const savedProductImage =
            await this.productImagesService.createProductImage({
              productId: savedProduct.id,
              path: filePath,
            });

          savedProductImage.product = savedProduct;

          await savedProductImage.save();
        }),
      );
    }

    return savedProduct;
  }

  async findAll(
    isActive?: boolean,
    isPromo?: boolean,
    phrase?: string,
    username?: string,
  ): Promise<Product[]> {
    let query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.rates', 'rates')
      .leftJoinAndSelect('rates.user', 'user');

    if (isActive !== undefined) {
      query = query.andWhere('product.isActive = :isActive', { isActive });
    }

    if (isPromo !== undefined) {
      query = query.andWhere('product.isPromo = :isPromo', { isPromo });
    }

    if (phrase) {
      query = query.andWhere('product.name ILIKE :phrase', {
        phrase: `%${phrase}%`,
      });
    }

    const products = await query.getMany();

    return products.map((product) => {
      const ratings = product.rates ?? [];

      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rate) => sum + rate.rating, 0) / ratings.length
          : 0;

      const userRating = username
        ? ratings.find((rate) => rate.user?.username === username)?.rating ??
          null
        : null;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        code: product.code,
        isActive: product.isActive,
        isPromo: product.isPromo,

        images: product.images.map((image) => ({
          id: image.id,
          path: image.path,
        })),

        averageRating: Number(averageRating.toFixed(2)),

        rating: userRating,
      };
    });
  }

  async findOneById(id: string, username?: string): Promise<Product | null> {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.rates', 'rates')
      .leftJoinAndSelect('rates.user', 'user')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      return null;
    }

    const ratings = product.rates ?? [];

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rate) => sum + rate.rating, 0) / ratings.length
        : 0;

    const userRating = username
      ? ratings.find((rate) => rate.user?.username === username)?.rating ?? null
      : null;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      code: product.code,
      isActive: product.isActive,
      isPromo: product.isPromo,
      images: product.images.map((image) => ({
        id: image.id,
        path: image.path,
      })),
      averageRating: Number(averageRating.toFixed(2)),
      rating: userRating,
    };
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
