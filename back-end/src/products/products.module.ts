import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductsModule {}
