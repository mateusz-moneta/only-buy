import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity, UserEntity } from './entities';
import { UsersService } from './services';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([RoleEntity, UserEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
