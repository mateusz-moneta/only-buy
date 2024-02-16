import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RefreshTokenEntity } from '../entities';
import { UsersService } from './users.service';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly userService: UsersService,
  ) {}

  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingToken) {
      await this.refreshTokenRepository.update(existingToken.id, {
        token,
        expiresAt,
      });

      return true;
    }

    await this.refreshTokenRepository
      .create({
        user,
        token,
        expiresAt,
      })
      .save();

    return true;
  }

  async findRefreshTokenByToken(
    token: string,
  ): Promise<RefreshTokenEntity | undefined> {
    return this.refreshTokenRepository
      .createQueryBuilder('refreshToken')
      .leftJoinAndSelect('refreshToken.user', 'user')
      .where('refreshToken.token = :token', { token })
      .getOne();
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await this.refreshTokenRepository.delete(id);
  }
}
