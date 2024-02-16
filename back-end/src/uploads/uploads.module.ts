import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads')
    }),
  ]
})
export class UploadsModule {}
