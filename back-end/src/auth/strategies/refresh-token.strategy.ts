import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../services';

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

  validate(req: Request, payload: any) {
    const isValid = this.authService.validateRefreshToken(payload.token);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { userId: payload.sub };
  }
}
