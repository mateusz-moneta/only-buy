import { Router } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';
import { createInjectionContextFactory } from '@ngneat/spectator/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Login,
  RefreshTokenRequest,
  RegisterRequest,
  Role,
} from '../../models';
import { AuthService, TokenStorageService } from '../../services';
import { AuthStore } from './auth.store';

describe(AuthStore.name, () => {
  const login = vi.fn();
  const register = vi.fn();
  const refreshToken = vi.fn();

  const setRefreshToken = vi.fn();
  const removeRefreshToken = vi.fn();

  const navigate = vi.fn();

  const createContext = createInjectionContextFactory({
    providers: [
      {
        provide: AuthService,
        useValue: {
          login,
          register,
          refreshToken,
        },
      },
      {
        provide: TokenStorageService,
        useValue: {
          setRefreshToken,
          removeRefreshToken,
        },
      },
      {
        provide: Router,
        useValue: {
          navigate,
        },
      },
      AuthStore,
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();

    login.mockReturnValue(
      of({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        avatar: '/avatar.png',
        username: 'john',
        role: 'USER' as Role,
      } satisfies Login)
    );

    register.mockReturnValue(of(true));

    refreshToken.mockReturnValue(
      of({
        accessToken: 'new-access-token',
        avatar: '/avatar.png',
        username: 'john',
        role: 'USER' as Role,
      })
    );
  });

  it('should create store with initial state', () => {
    const spectator = createContext();

    const store = spectator.inject(AuthStore);

    expect(store.accessToken()).toBeNull();
    expect(store.user()).toBeNull();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.isLoading()).toBe(true);
  });

  describe('login', () => {
    it('should login successfully', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      const payload = {
        username: 'john.example',
        password: 'password',
      };

      store.login(payload);

      expect(login).toHaveBeenCalledTimes(1);
      expect(login).toHaveBeenCalledWith(payload);

      expect(setRefreshToken).toHaveBeenCalledTimes(1);
      expect(setRefreshToken).toHaveBeenCalledWith('refresh-token');

      expect(store.accessToken()).toBe('access-token');
      expect(store.isAuthenticated()).toBe(true);

      expect(store.user()).toEqual({
        avatar: '/avatar.png',
        username: 'john',
        role: 'USER',
      });

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set loading state when login starts', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      const payload = {
        username: 'john.example',
        password: 'password',
      };

      store.login(payload);

      expect(store.isLoading()).toBe(true);
    });

    it('should clear authentication state when login fails', () => {
      login.mockReturnValue(throwError(() => new Error('Login failed')));

      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.login({
        username: 'john.example',
        password: 'wrong-password',
      });

      expect(removeRefreshToken).toHaveBeenCalledTimes(1);

      expect(store.accessToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.user()).toBeNull();

      expect(setRefreshToken).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should remove refresh token', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.logout();

      expect(removeRefreshToken).toHaveBeenCalledTimes(1);
    });

    it('should clear authentication state', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.logout();

      expect(store.accessToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should keep user state when logging out', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.logout();

      expect(store.user()).toBeNull();
    });
  });

  describe('register', () => {
    const payload: RegisterRequest = {
      email: 'john@example.com',
      password: 'password',
      username: 'john',
    };

    it('should register user successfully', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.register(payload);

      expect(register).toHaveBeenCalledTimes(1);
      expect(register).toHaveBeenCalledWith(payload);

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set loading state when registration starts', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.register(payload);

      expect(store.isLoading()).toBe(true);
    });

    it('should stop loading when registration fails', () => {
      register.mockReturnValue(
        throwError(() => new Error('Registration failed'))
      );

      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.register(payload);

      expect(store.isLoading()).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    const payload: RefreshTokenRequest = {
      refreshToken: 'refresh-token',
    };

    it('should refresh token successfully', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.refreshToken(payload);

      expect(refreshToken).toHaveBeenCalledTimes(1);
      expect(refreshToken).toHaveBeenCalledWith(payload);

      expect(store.accessToken()).toBe('new-access-token');
      expect(store.isAuthenticated()).toBe(true);
      expect(store.isLoading()).toBe(false);

      expect(store.user()).toEqual({
        avatar: '/avatar.png',
        username: 'john',
        role: 'USER',
      });
    });

    it('should set loading state when refresh starts', () => {
      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.refreshToken(payload);

      expect(store.isLoading()).toBe(false);
    });

    it('should clear authentication state when refresh fails', () => {
      refreshToken.mockReturnValue(
        throwError(() => new Error('Refresh failed'))
      );

      const spectator = createContext();
      const store = spectator.inject(AuthStore);

      store.refreshToken(payload);

      expect(removeRefreshToken).toHaveBeenCalledTimes(1);

      expect(store.accessToken()).toBeNull();
      expect(store.isAuthenticated()).toBe(false);
      expect(store.isLoading()).toBe(false);
      expect(store.user()).toBeNull();
    });
  });
});
