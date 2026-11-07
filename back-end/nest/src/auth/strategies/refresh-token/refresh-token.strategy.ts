import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../../services';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; token: string },
  ): Promise<{ userId: string }> {
    const isValid = await this.authService.validateRefreshToken(payload.token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: payload.sub };
  }
}
