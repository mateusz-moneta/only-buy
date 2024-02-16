import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from '../dto';
import { ProductEntity } from '../entities';
import { UploadService } from './upload.service';
import { ProductImagesService } from './product-images.service';

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
          const path = this.uploadService.saveFile(
            productImage,
            savedProduct.id,
          );
          const savedProductImage =
            await this.productImagesService.createProductImage({
              productId: savedProduct.id,
              path,
            });
          savedProductImage.product = savedProduct;

          await savedProductImage.save();
        }),
      );
    }

    return savedProduct;
  }

  findAll(isActive: boolean, isPromo: boolean): Promise<ProductEntity[]> {
    let query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.rates', 'rates');

    if (isActive !== undefined) {
      query = query.andWhere('product.isActive = :isActive', { isActive });
    }

    if (isPromo !== undefined) {
      query = query.andWhere('product.isPromo = :isPromo', { isPromo });
    }

    return query.getMany();
  }

  findOneById(id: string): Promise<ProductEntity | null> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .where({ id })
      .getOne();
  }

  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
