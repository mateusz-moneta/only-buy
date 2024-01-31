import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { ProductsController } from './products.controller';
import {
  ProductEntity,
  ProductImageEntity,
  ProductRateEntity,
} from './entities';
import {
  ProductImagesService,
  ProductRatesService,
  ProductsService,
  UploadService,
} from './services';

@Module({
  controllers: [ProductsController],
  imports: [
    MulterModule.register(),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductRateEntity,
    ]),
  ],
  providers: [
    ProductImagesService,
    ProductRatesService,
    ProductsService,
    UploadService,
  ],
})
export class ProductsModule {}
