import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { ProductsController } from './products.controller';
import { ProductEntity, ProductImageEntity } from './entities';
import { ProductImagesService } from './services/product-images.service';
import { ProductsService } from './services';
import { UploadService } from './services/upload.service';

@Module({
  controllers: [ProductsController],
  imports: [
    MulterModule.registerAsync({
      useClass: UploadService,
    }),
    TypeOrmModule.forFeature([ProductEntity, ProductImageEntity]),
  ],
  providers: [ProductImagesService, ProductsService, UploadService],
})
export class ProductsModule {}
