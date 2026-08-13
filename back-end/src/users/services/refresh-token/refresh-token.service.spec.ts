import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RefreshTokenEntity } from '../../entities';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from './refresh-token.service';

describe(RefreshTokenService.name, () => {
  let service: RefreshTokenService;

  const refreshTokenRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const userService = {
    findOneById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new RefreshTokenService(
      refreshTokenRepository as unknown as Repository<RefreshTokenEntity>,
      userService as unknown as UsersService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRefreshToken', () => {
    const userId = 'user-id';
    const token = 'refresh-token';
    const expiresAt = new Date('2030-01-01');

    it('should throw NotFoundException when user does not exist', async () => {
      userService.findOneById.mockResolvedValue(null);

      await expect(
        service.createRefreshToken(userId, token, expiresAt),
      ).rejects.toThrow(new NotFoundException('User not found'));

      expect(userService.findOneById).toHaveBeenCalledTimes(1);

      expect(userService.findOneById).toHaveBeenCalledWith(userId);

      expect(refreshTokenRepository.findOne).not.toHaveBeenCalled();
    });

    it('should update existing refresh token', async () => {
      const user = {
        id: userId,
      };

      const existingToken = {
        id: 123,
        token: 'old-token',
        expiresAt: new Date('2029-01-01'),
      };

      userService.findOneById.mockResolvedValue(user);

      refreshTokenRepository.findOne.mockResolvedValue(existingToken);

      refreshTokenRepository.update.mockResolvedValue({
        affected: 1,
      });

      const result = await service.createRefreshToken(userId, token, expiresAt);

      expect(userService.findOneById).toHaveBeenCalledWith(userId);

      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: {
            id: userId,
          },
        },
      });

      expect(refreshTokenRepository.update).toHaveBeenCalledTimes(1);

      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        existingToken.id,
        {
          token,
          expiresAt,
        },
      );

      expect(result).toBe(true);
    });

    it('should create new refresh token when existing token does not exist', async () => {
      const user = {
        id: userId,
      };

      const save = jest.fn().mockResolvedValue(undefined);

      const createdEntity = {
        save,
      };

      userService.findOneById.mockResolvedValue(user);

      refreshTokenRepository.findOne.mockResolvedValue(null);

      refreshTokenRepository.create.mockReturnValue(createdEntity);

      const result = await service.createRefreshToken(userId, token, expiresAt);

      expect(refreshTokenRepository.create).toHaveBeenCalledTimes(1);

      expect(refreshTokenRepository.create).toHaveBeenCalledWith({
        user,
        token,
        expiresAt,
      });

      expect(save).toHaveBeenCalledTimes(1);

      expect(result).toBe(true);
    });

    it('should not update existing token when creating a new token', async () => {
      const user = {
        id: userId,
      };

      const save = jest.fn().mockResolvedValue(undefined);

      userService.findOneById.mockResolvedValue(user);

      refreshTokenRepository.findOne.mockResolvedValue(null);

      refreshTokenRepository.create.mockReturnValue({
        save,
      });

      await service.createRefreshToken(userId, token, expiresAt);

      expect(refreshTokenRepository.update).not.toHaveBeenCalled();

      expect(save).toHaveBeenCalledTimes(1);
    });

    it('should not create a new token when existing token is updated', async () => {
      const user = {
        id: userId,
      };

      userService.findOneById.mockResolvedValue(user);

      refreshTokenRepository.findOne.mockResolvedValue({
        id: 123,
      });

      refreshTokenRepository.update.mockResolvedValue({
        affected: 1,
      });

      await service.createRefreshToken(userId, token, expiresAt);

      expect(refreshTokenRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findRefreshTokenByToken', () => {
    it('should return refresh token by token', async () => {
      const token = 'refresh-token';

      const refreshToken = {
        id: 123,
        token,
        expiresAt: new Date('2030-01-01'),
        user: {
          id: 'user-id',
        },
      } as unknown as RefreshTokenEntity;

      const query = {
        leftJoinAndSelect: jest.fn(),
        where: jest.fn(),
        getOne: jest.fn(),
      };

      query.leftJoinAndSelect.mockReturnValue(query);
      query.where.mockReturnValue(query);
      query.getOne.mockResolvedValue(refreshToken);

      refreshTokenRepository.createQueryBuilder.mockReturnValue(query);

      const result = await service.findRefreshTokenByToken(token);

      expect(refreshTokenRepository.createQueryBuilder).toHaveBeenCalledWith(
        'refreshToken',
      );

      expect(query.leftJoinAndSelect).toHaveBeenCalledWith(
        'refreshToken.user',
        'user',
      );

      expect(query.where).toHaveBeenCalledWith('refreshToken.token = :token', {
        token,
      });

      expect(query.getOne).toHaveBeenCalledTimes(1);

      expect(result).toBe(refreshToken);
    });

    it('should return null when refresh token does not exist', async () => {
      const query = {
        leftJoinAndSelect: jest.fn(),
        where: jest.fn(),
        getOne: jest.fn(),
      };

      query.leftJoinAndSelect.mockReturnValue(query);
      query.where.mockReturnValue(query);
      query.getOne.mockResolvedValue(null);

      refreshTokenRepository.createQueryBuilder.mockReturnValue(query);

      const result = await service.findRefreshTokenByToken('unknown-token');

      expect(result).toBeNull();
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete refresh token by id', async () => {
      refreshTokenRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await service.deleteRefreshToken(123);

      expect(refreshTokenRepository.delete).toHaveBeenCalledTimes(1);

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith(123);
    });
  });
});
