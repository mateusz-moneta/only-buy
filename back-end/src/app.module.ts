import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { CoreModule } from './core';
import { ProductsModule } from './products';

@Module({
  imports: [CoreModule, AuthModule, ProductsModule],
})
export class AppModule {}
