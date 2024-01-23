import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshTokenEntity, RoleEntity, UserEntity } from './entities';
import { RefreshTokenService, RolesService, UsersService } from './services';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity, RoleEntity, UserEntity]),
  ],
  providers: [RefreshTokenService, RolesService, UsersService],
  exports: [RefreshTokenService, UsersService],
})
export class UsersModule {}
