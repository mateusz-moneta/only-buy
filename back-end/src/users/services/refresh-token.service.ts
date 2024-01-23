import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async createRefreshToken(
    id: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshTokenEntity> {
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { id },
    });

    if (existingToken) {
      existingToken.token = token;
      existingToken.expiresAt = expiresAt;

      return this.refreshTokenRepository.save(existingToken);
    }

    const newRefreshToken = this.refreshTokenRepository.create({
      id,
      token,
      expiresAt,
    });

    return this.refreshTokenRepository.save(newRefreshToken);
  }

  async findRefreshTokenByToken(
    token: string,
  ): Promise<RefreshTokenEntity | undefined> {
    return this.refreshTokenRepository.findOneBy({ token });
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await this.refreshTokenRepository.delete(id);
  }
}
