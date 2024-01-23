import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from '../payloads';
import { Login, RefreshToken } from '../../users/models';
import { LoginUserDto } from '../../users/dto';
import { RefreshTokenService, UsersService } from '../../users/services';
import { UserEntity } from '../../users/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly usersService: UsersService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<Login | UnauthorizedException> {
    const { password, username } = loginUserDto;
    const user = await this.usersService.findOneByUsername(username);

    if (!!user) {
      const isMatch = bcrypt.compare(password, user.password);

      if (isMatch) {
        const refreshToken = this.generateRefreshToken();
        await this.createRefreshToken(
          user.id,
          refreshToken.token,
          refreshToken.expiresAt,
        );

        return {
          accessToken: await this.generateAccessToken(user),
          refreshToken: refreshToken.token,
        };
      }
    }

    throw new UnauthorizedException();
  }

  async generateAccessToken({
    id: sub,
    username,
  }: UserEntity): Promise<string> {
    const payload: JwtPayload = { username, sub };

    return this.jwtService.sign(payload);
  }

  async getAccessTokenFromRefreshToken(
    refreshToken: string,
  ): Promise<string | null> {
    const existingRefreshToken =
      await this.refreshTokenService.findRefreshTokenByToken(refreshToken);

    if (!existingRefreshToken || existingRefreshToken.expiresAt < new Date()) {
      return null;
    }

    const user = await this.usersService.findOneById(
      existingRefreshToken.user.id,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.generateAccessToken(user);
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken =
      await this.refreshTokenService.findRefreshTokenByToken(token);

    return !!refreshToken && refreshToken.expiresAt >= new Date();
  }

  async validateUserById(userId: string): Promise<UserEntity | null> {
    try {
      return await this.usersService.findOneById(userId);
    } catch (error) {
      return null;
    }
  }

  private generateRefreshToken(): RefreshToken {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return { token, expiresAt };
  }

  private async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ) {
    return this.refreshTokenService.createRefreshToken(
      userId,
      token,
      expiresAt,
    );
  }
}
