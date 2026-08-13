import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '../../../users/models';
import { RolesGuard } from './roles.guard';

describe(RolesGuard.name, () => {
  let guard: RolesGuard;

  const reflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const context = createExecutionContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      expect.any(String),
      [context.getHandler(), context.getClass()],
    );
  });

  it('should return true when required roles array is empty', () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    const context = createExecutionContext();

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should return true when user has required role', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN' as Role]);

    const request = {
      user: {
        id: 'user-id',
        username: 'admin',
        role: 'ADMIN' as Role,
      },
    };

    const context = createExecutionContext(request);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should return true when user has one of the required roles', () => {
    reflector.getAllAndOverride.mockReturnValue([
      'ADMIN',
      'STANDARD',
    ] as Role[]);

    const request = {
      user: {
        id: 'user-id',
        username: 'john',
        role: 'STANDARD' as Role,
      },
    };

    const context = createExecutionContext(request);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user is not authenticated', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN' as Role]);

    const request = {
      user: undefined,
    };

    const context = createExecutionContext(request);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('User not authenticated'),
    );
  });

  it('should throw ForbiddenException when user does not have required role', () => {
    reflector.getAllAndOverride.mockReturnValue(['ADMIN' as Role]);

    const request = {
      user: {
        id: 'user-id',
        username: 'john',
        role: 'STANDARD' as Role,
      },
    };

    const context = createExecutionContext(request);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException(
        'You do not have permission to access this resource',
      ),
    );
  });

  it('should check roles using handler and class', () => {
    reflector.getAllAndOverride.mockReturnValue([]);

    const context = createExecutionContext();

    guard.canActivate(context);

    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      expect.any(String),
      [context.getHandler(), context.getClass()],
    );
  });

  function createExecutionContext(
    request = {
      user: {
        id: 'user-id',
        username: 'john',
        role: 'STANDARD' as Role,
      },
    },
  ): ExecutionContext {
    const handler = jest.fn();
    const controller = jest.fn();

    return {
      getHandler: jest.fn().mockReturnValue(handler),
      getClass: jest.fn().mockReturnValue(controller),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
  }
});
