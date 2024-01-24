import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity, UserEntity } from './entities';
import { RefreshTokenService, UsersService } from './services';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles';

@Module({
  controllers: [UsersController],
  imports: [
    RolesModule,
    TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
  ],
  providers: [RefreshTokenService, UsersService],
  exports: [RefreshTokenService, UsersService],
})
export class UsersModule {}
