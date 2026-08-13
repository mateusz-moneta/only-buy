import { signal } from '@angular/core';
import { EMPTY, firstValueFrom } from 'rxjs';
import { createInjectionContextFactory } from '@ngneat/spectator/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TokenStorageService } from '../../services';
import { AuthStore } from '../../state';
import { appInitializer } from './app.initializer';

describe(appInitializer.name, () => {
  const getRefreshToken = vi.fn();
  const refreshToken = vi.fn();

  const isLoading = signal(false);

  const createContext = createInjectionContextFactory({
    providers: [
      {
        provide: TokenStorageService,
        useValue: {
          getRefreshToken,
        },
      },
      {
        provide: AuthStore,
        useValue: {
          refreshToken,
          isLoading,
        },
      },
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
    isLoading.set(false);
  });

  it('should return EMPTY when refresh token does not exist', () => {
    getRefreshToken.mockReturnValue(null);

    const spectator = createContext();

    const observable = spectator.runInInjectionContext(() => appInitializer());

    expect(observable).toBe(EMPTY);
    expect(refreshToken).not.toHaveBeenCalled();
  });

  it('should refresh token when refresh token exists', () => {
    getRefreshToken.mockReturnValue('refresh-token');

    const spectator = createContext();

    spectator.runInInjectionContext(() => appInitializer());

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(refreshToken).toHaveBeenCalledWith({
      refreshToken: 'refresh-token',
    });
  });

  it('should wait until loading is finished', async () => {
    getRefreshToken.mockReturnValue('refresh-token');

    isLoading.set(true);

    const spectator = createContext();

    const result = spectator.runInInjectionContext(() =>
      firstValueFrom(appInitializer())
    );

    expect(refreshToken).toHaveBeenCalledTimes(1);

    isLoading.set(false);

    await expect(result).resolves.toBe(false);
  });
});
