import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/services';
import { LoginUserDto } from '../../users/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string } | UnauthorizedException> {
    const { password, username } = loginUserDto;
    const user = await this.usersService.findOneByUsername(username);

    if (!!user) {
      const isMatch = bcrypt.compare(password, user.password);

      if (isMatch) {
        const payload = { sub: user.id, username: user.username };

        return {
          accessToken: await this.jwtService.signAsync(payload),
        };
      }
    }

    throw new UnauthorizedException();
  }
}
