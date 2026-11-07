import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';
import { IS_PUBLIC_KEY } from '../../decorators';

describe(AuthGuard.name, () => {
  let guard: AuthGuard;

  const configService = {
    get: jest.fn(),
  };

  const jwtService = {
    verifyAsync: jest.fn(),
  };

  const reflector = {
    getAllAndOverride: jest.fn(),
  };

  const createExecutionContext = (authorization?: string): ExecutionContext => {
    const request = {
      headers: {
        authorization,
      },
    };

    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    configService.get.mockReturnValue('test-secret');
    reflector.getAllAndOverride.mockReturnValue(false);

    guard = new AuthGuard(
      configService as unknown as ConfigService,
      jwtService as unknown as JwtService,
      reflector as unknown as Reflector,
    );
  });

  it('should be created', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to public route', async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    const context = createExecutionContext();

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when authorization header is missing', async () => {
    const context = createExecutionContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when authorization type is not Bearer', async () => {
    const context = createExecutionContext('Basic token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when Bearer token is missing', async () => {
    const context = createExecutionContext('Bearer');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should allow access with valid Bearer token', async () => {
    const payload = {
      sub: 'user-id',
      username: 'john',
      role: 'STANDARD',
    };

    jwtService.verifyAsync.mockResolvedValue(payload);

    const context = createExecutionContext('Bearer valid-token');

    const result = await guard.canActivate(context);

    expect(result).toBe(true);

    expect(jwtService.verifyAsync).toHaveBeenCalledTimes(1);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'test-secret',
    });
  });

  it('should assign JWT payload to request user', async () => {
    const payload = {
      sub: 'user-id',
      username: 'john',
      role: 'STANDARD',
    };

    jwtService.verifyAsync.mockResolvedValue(payload);

    const request = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;

    await guard.canActivate(context);

    expect(request['user']).toEqual(payload);
  });

  it('should throw UnauthorizedException when JWT verification fails', async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const context = createExecutionContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid-token', {
      secret: 'test-secret',
    });
  });

  it('should use SECRET from ConfigService', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
    });

    configService.get.mockReturnValue('my-secret');

    const context = createExecutionContext('Bearer valid-token');

    await guard.canActivate(context);

    expect(configService.get).toHaveBeenCalledWith('SECRET');

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: 'my-secret',
    });
  });
});
