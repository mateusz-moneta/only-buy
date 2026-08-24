import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from '../../dto';
import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from '../../entities';

import { UploadService } from '../../../uploads/services';
import { ProductImagesService } from '../product-images/product-images.service';

import { Product, ProductImage } from '../../models';
import { Page } from '../../../shared/models';

interface ProductRatingRaw {
  product_id: string;
  averageRating: string | null;
  ratingCount: string;
  userRating: string | null;
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,

    @InjectRepository(ProductRateEntity)
    private readonly productRatesRepository: Repository<ProductRateEntity>,

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
      details: createProduct.details,
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
    userId?: string,
    page?: number,
    limit?: number,
  ): Promise<Page<Product>> {
    const query = this.getProductQuery();

    if (isActive !== undefined) {
      query.andWhere('product.isActive = :isActive', { isActive });
    }

    if (isPromo !== undefined) {
      query.andWhere('product.isPromo = :isPromo', { isPromo });
    }

    if (phrase) {
      query.andWhere('product.name ILIKE :phrase', { phrase: `%${phrase}%` });
    }

    const defaultLimit = this.configService.get<number>('DEFAULT_LIMIT', 20);

    const maxLimit = this.configService.get<number>('MAX_LIMIT', 100);

    const currentPage = Math.max(1, Number(page) || 1);

    const pageSize = Math.min(
      Math.max(1, Number(limit) || defaultLimit),
      maxLimit,
    );

    const [products, total] = await query
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const productIds = products.map((product) => product.id);

    const ratingMap = await this.getProductRatings(productIds, userId);

    return {
      data: products.map((product) =>
        this.mapProduct(product, ratingMap.get(product.id)),
      ),
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOneById(id: string, userId?: string): Promise<Product | null> {
    const product = await this.getProductQuery()
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      return null;
    }

    const ratingMap = await this.getProductRatings([id], userId);

    return this.mapProduct(product, ratingMap.get(id));
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async updateProduct(
    id: string,
    updateProduct: UpdateProductDto,
    productImages: Express.Multer.File[],
    userId?: string,
  ): Promise<Product> {
    const queryRunner =
      this.productsRepository.manager.connection.createQueryRunner();

    const createdFiles: string[] = [];
    const deletedFiles: string[] = [];

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOne(ProductEntity, {
        where: { id },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      product.name = updateProduct.name;
      product.description = updateProduct.description;
      product.price = parseFloat(updateProduct.price);
      product.code = updateProduct.code;
      product.isActive = updateProduct.isActive === 'true';
      product.isPromo = updateProduct.isPromo === 'true';

      const deletedImageIds = Array.isArray(updateProduct.deletedImageIds)
        ? updateProduct.deletedImageIds
        : updateProduct.deletedImageIds
          ? [updateProduct.deletedImageIds]
          : [];

      const savedProduct = await queryRunner.manager.save(product);

      if (deletedImageIds.length) {
        const images = await queryRunner.manager
          .createQueryBuilder(ProductImageEntity, 'image')
          .where('image.id IN (:...ids)', {
            ids: deletedImageIds,
          })
          .andWhere('image.productId = :productId', {
            productId: id,
          })
          .getMany();

        for (const image of images) {
          deletedFiles.push(image.path);

          await queryRunner.manager.delete(ProductImageEntity, image.id);
        }
      }

      if (productImages?.length) {
        for (const productImage of productImages) {
          const filePath = this.uploadService.saveFile(
            productImage,
            `product-images/${savedProduct.id}`,
          );

          createdFiles.push(filePath);

          const image = new ProductImageEntity({
            path: filePath,
            product: savedProduct,
          });

          await queryRunner.manager.save(image);
        }
      }

      await queryRunner.commitTransaction();

      for (const filePath of deletedFiles) {
        this.uploadService.deleteFile(filePath);
      }

      const result = await this.getProductQuery()
        .where('product.id = :id', { id })
        .getOne();

      if (!result) {
        throw new NotFoundException('Product not found');
      }

      const ratingMap = await this.getProductRatings([id], userId);

      return this.mapProduct(result, ratingMap.get(id));
    } catch (error) {
      await queryRunner.rollbackTransaction();

      for (const filePath of createdFiles) {
        this.uploadService.deleteFile(filePath);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getProductQuery() {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images');
  }

  private async getProductRatings(
    productIds: string[],
    userId?: string,
  ): Promise<Map<string, ProductRatingRaw>> {
    if (!productIds.length) {
      return new Map();
    }

    const averageQuery = this.productRatesRepository
      .createQueryBuilder('rate')
      .select('rate.productId', 'product_id')
      .addSelect('AVG(rate.rating)', 'averageRating')
      .addSelect('COUNT(rate.rating)', 'ratingCount')
      .where('rate.productId IN (:...productIds)', { productIds })
      .groupBy('rate.productId');

    const rows = await averageQuery.getRawMany<ProductRatingRaw>();

    const ratingMap = new Map<string, ProductRatingRaw>();

    for (const row of rows) {
      ratingMap.set(row.product_id, {
        product_id: row.product_id,
        averageRating: row.averageRating,
        ratingCount: row.ratingCount,
        userRating: null,
      });
    }

    if (userId) {
      const userRatings = await this.productRatesRepository
        .createQueryBuilder('rate')
        .select('rate.productId', 'product_id')
        .addSelect('rate.rating', 'userRating')
        .where('rate.productId IN (:...productIds)', { productIds })
        .andWhere('rate.userId = :userId', { userId })
        .getRawMany<{
          product_id: string;
          userRating: number;
        }>();

      for (const row of userRatings) {
        const existing = ratingMap.get(row.product_id);

        ratingMap.set(row.product_id, {
          product_id: row.product_id,
          averageRating: existing?.averageRating ?? null,
          ratingCount: existing?.ratingCount ?? '0',
          userRating: String(row.userRating),
        });
      }
    }

    return ratingMap;
  }

  private mapProduct(
    product: ProductEntity,
    rating?: ProductRatingRaw,
  ): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      details: product.details,
      price: product.price,
      code: product.code,
      isActive: product.isActive,
      isPromo: product.isPromo,
      images: product.images.map((image: ProductImageEntity): ProductImage => ({
        id: image.id,
        path: image.path,
      })),
      averageRating: Number(rating?.averageRating ?? 0),
      rating:
        rating?.userRating !== null && rating?.userRating !== undefined
          ? Number(rating.userRating)
          : null,
      ratingCount: Number(rating?.ratingCount ?? 0),
    };
  }
}
