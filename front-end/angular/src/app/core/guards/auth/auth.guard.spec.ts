import { Router } from '@angular/router';
import { createInjectionContextFactory } from '@ngneat/spectator/vitest';
import { describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../state';
import { authGuard } from './auth.guard';

describe(authGuard.name, () => {
  const accessToken = vi.fn();
  const navigate = vi.fn();

  const createContext = createInjectionContextFactory({
    providers: [
      {
        provide: AuthStore,
        useValue: {
          accessToken,
        },
      },
      {
        provide: Router,
        useValue: {
          navigate,
        },
      },
    ],
  });

  it('should allow access when access token exists', () => {
    accessToken.mockReturnValue('access-token');

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when access token does not exist', () => {
    accessToken.mockReturnValue(null);

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login when access token is empty', () => {
    accessToken.mockReturnValue('');

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
