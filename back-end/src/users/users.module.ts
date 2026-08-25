import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity, UserEntity } from './entities';
import { RefreshTokenService, UsersService } from './services';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles';
import { UploadsModule } from '../uploads';
import { AuditLogsModule } from '../audit-logs';

@Module({
  controllers: [UsersController],
  imports: [
    AuditLogsModule,
    RolesModule,
    TypeOrmModule.forFeature([RefreshTokenEntity, UserEntity]),
    UploadsModule,
  ],
  providers: [RefreshTokenService, UsersService],
  exports: [RefreshTokenService, UsersService],
})
export class UsersModule {}
