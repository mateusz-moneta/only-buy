import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { JwtPayload } from '../payloads';
import { Login, RefreshToken, Role } from '../../users/models';
import { LoginUserDto } from '../../users/dto';
import { RefreshTokenService, UsersService } from '../../users/services';
import { UserEntity } from '../../users/entities';
import { UserData } from '../../users/models/user-data.model';

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
      if (!user.active) {
        throw new UnauthorizedException('Account is inactive');
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (isMatch) {
        const refreshToken = this.generateRefreshToken();
        await this.createRefreshToken(
          user.id,
          refreshToken.token,
          refreshToken.expiresAt,
        );

        const { role, username } = user;

        return {
          avatar: user.avatar ?? null,
          username,
          role: role.name,
          accessToken: await this.generateAccessToken(
            user.id,
            role.name as Role,
            username,
          ),
          refreshToken: refreshToken.token,
        };
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async generateAccessToken(
    sub: string,
    role: Role,
    username: string,
  ): Promise<string> {
    const payload: JwtPayload = { username, role, sub };

    return this.jwtService.sign(payload);
  }

  async getUserDataFromRefreshToken(
    refreshToken: string,
  ): Promise<UserData | null> {
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

    const { avatar, role, username } = user;

    return {
      avatar,
      username,
      role: role.name,
      accessToken: await this.generateAccessToken(
        user.id,
        role.name as Role,
        username,
      ),
    };
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
