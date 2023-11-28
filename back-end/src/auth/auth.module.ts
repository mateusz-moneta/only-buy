import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthGuard } from './guards';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { AuthService } from './services';
import { UsersModule } from '../users';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [
    AccessTokenStrategy,
    AuthService,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
