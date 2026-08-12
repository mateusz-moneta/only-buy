import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { ProductEntity, ProductImageEntity } from '../entities';
import { UploadService } from '../../uploads/services';
import { ProductImagesService } from './product-images.service';
import { Product, ProductImage } from '../models';

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
    let query = this.getProductQuery();

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

    return products.map((product) => this.mapProduct(product, username));
  }

  async findOneById(id: string, username?: string): Promise<Product | null> {
    const product = await this.getProductQuery()
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      return null;
    }

    return this.mapProduct(product, username);
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async updateProduct(
    id: string,
    updateProduct: UpdateProductDto,
    productImages: Express.Multer.File[],
    username?: string,
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
          .andWhere('image.productId = :productId', { productId: id })
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

      return this.mapProduct(result, username);
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
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.rates', 'rates')
      .leftJoinAndSelect('rates.user', 'user');
  }

  private mapProduct(product: ProductEntity, username?: string): Product {
    const ratings = product.rates ?? [];

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rate) => sum + rate.rating, 0) / ratings.length
        : 0;

    const userRating = username
      ? (ratings.find((rate) => rate.user?.username === username)?.rating ??
        null)
      : null;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      code: product.code,
      isActive: product.isActive,
      isPromo: product.isPromo,
      images: product.images.map((image: ProductImageEntity): ProductImage => ({
        id: image.id,
        path: image.path,
      })),
      averageRating: Number(averageRating.toFixed(2)),
      rating: userRating,
    };
  }
}
