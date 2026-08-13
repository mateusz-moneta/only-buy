import { Router } from '@angular/router';
import { createInjectionContextFactory } from '@ngneat/spectator/vitest';
import { describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../state';
import { adminGuard } from './admin.guard';

describe(adminGuard.name, () => {
  const user = vi.fn();
  const navigate = vi.fn();

  const createContext = createInjectionContextFactory({
    providers: [
      {
        provide: AuthStore,
        useValue: {
          user,
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

  it('should allow access for admin user', () => {
    user.mockReturnValue({
      role: 'ADMIN',
    });

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    );

    expect(result).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should reject access for standard user', () => {
    user.mockReturnValue({
      role: 'STANDARD',
    });

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    );

    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });

  it('should reject access when user is not authenticated', () => {
    user.mockReturnValue(null);

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      adminGuard({} as never, {} as never)
    );

    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});
