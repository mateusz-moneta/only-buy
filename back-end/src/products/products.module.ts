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
} from './services';
import { UsersModule } from '../users';
import { UploadsModule } from '../uploads';
import { AuditLogsModule } from '../audit-logs';

@Module({
  controllers: [ProductsController],
  imports: [
    AuditLogsModule,
    MulterModule.register(),
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductImageEntity,
      ProductRateEntity,
    ]),
    UploadsModule,
    UsersModule,
  ],
  providers: [
    JwtService,
    ProductImagesService,
    ProductRatesService,
    ProductsService,
  ],
})
export class ProductsModule {}
