import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from '../dto';
import { ProductEntity, ProductImageEntity } from '../entities';
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

  async createProduct(createProduct: CreateProductDto): Promise<ProductEntity> {
    const product = this.productsRepository.create(createProduct);

    const savedProduct = await this.productsRepository.save(product);
    const productImages: ProductImageEntity[] = [];

    if (createProduct.productImages?.length) {
      for (const image of createProduct.productImages) {
        const path = await this.uploadService.uploadFile(image);
        const productImage = await this.productImagesService.createProductImage(
          {
            productId: savedProduct.id,
            path,
          },
        );
        productImages.push(productImage);
      }
    }

    savedProduct.productsImages = productImages;

    return savedProduct;
  }

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
