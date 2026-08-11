import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity, UserEntity } from './entities';
import { RefreshTokenService, UsersService } from './services';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles';
import { UploadsModule } from '../uploads';

@Module({
  controllers: [UsersController],
  imports: [
    RolesModule,
    TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
    UploadsModule,
  ],
  providers: [RefreshTokenService, UsersService],
  exports: [RefreshTokenService, UsersService],
})
export class UsersModule {}
