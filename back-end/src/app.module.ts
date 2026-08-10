import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { CoreModule } from './core';
import { ProductsModule } from './products';
import { UploadsModule } from './uploads';

@Module({
  imports: [CoreModule, AuthModule, ProductsModule, UploadsModule],
})
export class AppModule {}
