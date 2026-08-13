import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../services';
import { UserEntity } from '../../../users/entities';

import { AccessTokenStrategy } from './access-token.strategy';
import { Role } from '../../../users/models';

describe(AccessTokenStrategy.name, () => {
  let strategy: AccessTokenStrategy;

  const validateUserById = jest.fn();

  const authService = {
    validateUserById,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    process.env.SECRET = 'test-secret';

    strategy = new AccessTokenStrategy(authService as unknown as AuthService);
  });

  it('should be created', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user when JWT payload contains valid user id', async () => {
    const user = {
      id: 'user-id',
      username: 'john',
      email: 'john@example.com',
    } as UserEntity;

    validateUserById.mockResolvedValue(user);

    const payload = {
      sub: 'user-id',
      username: 'john',
      role: 'STANDARD' as Role,
    };

    const result = await strategy.validate(payload);

    expect(validateUserById).toHaveBeenCalledTimes(1);
    expect(validateUserById).toHaveBeenCalledWith('user-id');

    expect(result).toBe(user);
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    validateUserById.mockResolvedValue(null);

    const payload = {
      sub: 'unknown-user-id',
      username: 'john',
      role: 'STANDARD' as Role,
    };

    await expect(strategy.validate(payload)).rejects.toThrow(
      new UnauthorizedException('Invalid token'),
    );

    expect(validateUserById).toHaveBeenCalledTimes(1);
    expect(validateUserById).toHaveBeenCalledWith('unknown-user-id');
  });
});
