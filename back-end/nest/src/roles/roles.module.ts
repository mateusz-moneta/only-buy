import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './entities';
import { RolesService } from './services';
import { RolesController } from './roles.controller';

@Module({
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
