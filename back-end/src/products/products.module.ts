import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductEntity, ProductImageEntity } from './entities';
import { ProductsService } from './services';

@Module({
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductImageEntity])],
  providers: [ProductsService],
})
export class ProductsModule {}
