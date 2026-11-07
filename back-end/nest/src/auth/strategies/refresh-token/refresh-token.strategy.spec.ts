import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../../services';
import { RefreshTokenStrategy } from './refresh-token.strategy';

describe(RefreshTokenStrategy.name, () => {
  let strategy: RefreshTokenStrategy;

  const validateRefreshToken = jest.fn();

  const authService = {
    validateRefreshToken,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.SECRET = 'test-secret';

    strategy = new RefreshTokenStrategy(authService as unknown as AuthService);
  });

  it('should be created', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user id when refresh token is valid', async () => {
    validateRefreshToken.mockResolvedValue(true);

    const request = {} as Request;

    const payload = {
      sub: 'user-id',
      token: 'refresh-token',
    };

    const result = await strategy.validate(request, payload);

    expect(validateRefreshToken).toHaveBeenCalledTimes(1);
    expect(validateRefreshToken).toHaveBeenCalledWith('refresh-token');

    expect(result).toEqual({
      userId: 'user-id',
    });
  });

  it('should throw UnauthorizedException when refresh token is invalid', async () => {
    validateRefreshToken.mockResolvedValue(false);

    const request = {} as Request;

    const payload = {
      sub: 'user-id',
      token: 'invalid-refresh-token',
    };

    await expect(strategy.validate(request, payload)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token'),
    );

    expect(validateRefreshToken).toHaveBeenCalledTimes(1);
    expect(validateRefreshToken).toHaveBeenCalledWith('invalid-refresh-token');
  });

  it('should use user id from JWT payload', async () => {
    validateRefreshToken.mockResolvedValue(true);

    const payload = {
      sub: 'another-user-id',
      token: 'refresh-token',
    };

    const result = await strategy.validate({} as Request, payload);

    expect(result).toEqual({
      userId: 'another-user-id',
    });
  });
});
