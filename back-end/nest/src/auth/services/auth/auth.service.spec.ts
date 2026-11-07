import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { RefreshTokenService, UsersService } from '../../../users/services';
import { RefreshTokenEntity, UserEntity } from '../../../users/entities';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe(AuthService.name, () => {
  let service: AuthService;

  const jwtService = {
    sign: jest.fn(),
  };

  const refreshTokenService = {
    findRefreshTokenByToken: jest.fn(),
    createRefreshToken: jest.fn(),
  };

  const usersService = {
    findOneByUsername: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new AuthService(
      jwtService as unknown as JwtService,
      refreshTokenService as unknown as RefreshTokenService,
      usersService as unknown as UsersService,
    );
  });

  describe('login', () => {
    const user = {
      id: 'user-id',
      username: 'john',
      password: 'hashed-password',
      active: true,
      avatar: '/avatar.png',
      role: {
        name: 'STANDARD',
      },
    };

    const loginDto = {
      username: 'john',
      password: 'password',
    };

    beforeEach(() => {
      usersService.findOneByUsername.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.sign.mockReturnValue('access-token');

      refreshTokenService.createRefreshToken.mockResolvedValue({
        id: 'refresh-token-id',
      });
    });

    it('should login user with valid credentials', async () => {
      const result = await service.login(loginDto);

      expect(usersService.findOneByUsername).toHaveBeenCalledWith('john');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        'hashed-password',
      );

      expect(refreshTokenService.createRefreshToken).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        expect.objectContaining({
          avatar: '/avatar.png',
          username: 'john',
          role: 'STANDARD',
          accessToken: 'access-token',
        }),
      );

      expect(result.refreshToken).toEqual(expect.any(String));
    });

    it('should return null avatar when user has no avatar', async () => {
      usersService.findOneByUsername.mockResolvedValue({
        ...user,
        avatar: null,
      });

      const result = await service.login(loginDto);

      expect(result.avatar).toBeNull();
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      usersService.findOneByUsername.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(refreshTokenService.createRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when account is inactive', async () => {
      usersService.findOneByUsername.mockResolvedValue({
        ...user,
        active: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Account is inactive'),
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(refreshTokenService.createRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );

      expect(refreshTokenService.createRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload', async () => {
      jwtService.sign.mockReturnValue('access-token');

      const result = await service.generateAccessToken(
        'user-id',
        'ADMIN',
        'admin',
      );

      expect(result).toBe('access-token');

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id',
        role: 'ADMIN',
        username: 'admin',
      });
    });
  });

  describe('getUserDataFromRefreshToken', () => {
    const refreshToken = 'refresh-token';

    const user = {
      id: 'user-id',
      username: 'john',
      avatar: '/avatar.png',
      role: {
        name: 'STANDARD',
      },
    };

    it('should return user data for valid refresh token', async () => {
      const refreshToken = 'refresh-token';

      const existingRefreshToken = {
        id: 1,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 60_000),
        user: {
          id: 'user-id',
        },
      } as unknown as RefreshTokenEntity;

      const user = {
        id: 'user-id',
        username: 'john',
        avatar: 'avatar.png',
        role: {
          name: 'STANDARD',
        },
      } as unknown as UserEntity;

      const accessToken = 'access-token';

      refreshTokenService.findRefreshTokenByToken.mockResolvedValue(
        existingRefreshToken,
      );

      usersService.findOneById.mockResolvedValue(user);

      jwtService.sign.mockReturnValue(accessToken);

      const result = await service.getUserDataFromRefreshToken(refreshToken);

      expect(refreshTokenService.findRefreshTokenByToken).toHaveBeenCalledTimes(
        1,
      );

      expect(refreshTokenService.findRefreshTokenByToken).toHaveBeenCalledWith(
        refreshToken,
      );

      expect(usersService.findOneById).toHaveBeenCalledTimes(1);

      expect(usersService.findOneById).toHaveBeenCalledWith('user-id');

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'john',
        role: 'STANDARD',
        sub: 'user-id',
      });

      expect(result).toEqual({
        avatar: 'avatar.png',
        username: 'john',
        role: 'STANDARD',
        accessToken,
      });
    });

    it('should throw UnauthorizedException when refresh token does not exist', async () => {
      refreshTokenService.findRefreshTokenByToken.mockResolvedValue(null);

      await expect(
        service.getUserDataFromRefreshToken(refreshToken),
      ).rejects.toThrow(
        new UnauthorizedException('Invalid or expired refresh token'),
      );

      expect(usersService.findOneById).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when refresh token is expired', async () => {
      const expiresAt = new Date(Date.now() - 1000);

      refreshTokenService.findRefreshTokenByToken.mockResolvedValue({
        token: refreshToken,
        expiresAt,
        user,
      });

      await expect(
        service.getUserDataFromRefreshToken(refreshToken),
      ).rejects.toThrow(
        new UnauthorizedException('Invalid or expired refresh token'),
      );

      expect(usersService.findOneById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when refresh token user does not exist', async () => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      refreshTokenService.findRefreshTokenByToken.mockResolvedValue({
        token: refreshToken,
        expiresAt,
        user,
      });

      usersService.findOneById.mockResolvedValue(null);

      await expect(
        service.getUserDataFromRefreshToken(refreshToken),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });
  });

  describe('validateRefreshToken', () => {
    it('should return true for valid refresh token', async () => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      refreshTokenService.findRefreshTokenByToken.mockResolvedValue({
        token: 'refresh-token',
        expiresAt,
      });

      const result = await service.validateRefreshToken('refresh-token');

      expect(result).toBe(true);

      expect(refreshTokenService.findRefreshTokenByToken).toHaveBeenCalledWith(
        'refresh-token',
      );
    });

    it('should return false when refresh token does not exist', async () => {
      refreshTokenService.findRefreshTokenByToken.mockResolvedValue(null);

      const result = await service.validateRefreshToken('invalid-token');

      expect(result).toBe(false);
    });

    it('should return false when refresh token is expired', async () => {
      const expiresAt = new Date(Date.now() - 1000);

      refreshTokenService.findRefreshTokenByToken.mockResolvedValue({
        token: 'refresh-token',
        expiresAt,
      });

      const result = await service.validateRefreshToken('refresh-token');

      expect(result).toBe(false);
    });
  });

  describe('validateUserById', () => {
    it('should return user when user exists', async () => {
      const user = {
        id: 'user-id',
        username: 'john',
      };

      usersService.findOneById.mockResolvedValue(user);

      const result = await service.validateUserById('user-id');

      expect(result).toEqual(user);

      expect(usersService.findOneById).toHaveBeenCalledWith('user-id');
    });

    it('should return null when user does not exist', async () => {
      usersService.findOneById.mockResolvedValue(null);

      const result = await service.validateUserById('unknown-id');

      expect(result).toBeNull();
    });

    it('should return null when users service throws an error', async () => {
      usersService.findOneById.mockRejectedValue(new Error('Database error'));

      const result = await service.validateUserById('user-id');

      expect(result).toBeNull();
    });
  });
});
