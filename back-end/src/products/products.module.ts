import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import { UsersModule } from '../users';

@Module({
  controllers: [ProductsController],
  imports: [
    MulterModule.register(),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductRateEntity,
    ]),
    UsersModule,
  ],
  providers: [
    JwtService,
    ProductImagesService,
    ProductRatesService,
    ProductsService,
    UploadService,
  ],
})
export class ProductsModule {}
