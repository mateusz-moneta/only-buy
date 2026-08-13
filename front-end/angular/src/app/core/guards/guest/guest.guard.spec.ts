import { Router } from '@angular/router';
import { createInjectionContextFactory } from '@ngneat/spectator/vitest';
import { describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../state';
import { guestGuard } from './guest.guard';

describe(guestGuard.name, () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access when user is not authenticated', () => {
    accessToken.mockReturnValue(null);

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      guestGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is authenticated', () => {
    accessToken.mockReturnValue('access-token');

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      guestGuard({} as never, {} as never)
    );

    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access when access token is empty', () => {
    accessToken.mockReturnValue('');

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      guestGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });
});
