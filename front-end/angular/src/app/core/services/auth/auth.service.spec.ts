import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it } from 'vitest';
import {
  Login,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  UserData,
} from '../../models';
import { AuthService } from './auth.service';

describe(AuthService.name, () => {
  let spectator: SpectatorHttp<AuthService>;

  const createService = createHttpFactory(AuthService);

  it('should be created', () => {
    spectator = createService();

    expect(spectator.service).toBeTruthy();
  });

  it('should login user', () => {
    spectator = createService();

    const payload: LoginRequest = {
      username: 'admin',
      password: 'TestPassword123!',
    };

    const response: Login = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      username: 'admin',
      role: 'ADMIN',
      avatar: 'uploads/avatar.jpg',
    };

    spectator.service.login(payload).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = spectator.expectOne('/api/auth/login', HttpMethod.POST);

    expect(request.request.body).toEqual(payload);

    request.flush(response);
  });

  it('should refresh access token', () => {
    spectator = createService();

    const payload: RefreshTokenRequest = {
      refreshToken: 'refresh-token',
    };

    const response: UserData = {
      accessToken: 'new-access-token',
      username: 'admin',
      role: 'ADMIN',
      avatar: 'uploads/avatar.jpg',
    };

    spectator.service.refreshToken(payload).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = spectator.expectOne('/api/auth/refresh', HttpMethod.POST);

    expect(request.request.body).toEqual(payload);

    request.flush(response);
  });

  it('should register user without avatar', () => {
    spectator = createService();

    const payload: RegisterRequest = {
      username: 'new-user',
      email: 'user@example.com',
      password: 'TestPassword123!',
    };

    spectator.service.register(payload).subscribe((result) => {
      expect(result).toBe(true);
    });

    const request = spectator.expectOne('/api/auth/register', HttpMethod.POST);

    expect(request.request.body).toBeInstanceOf(FormData);

    const formData = request.request.body as FormData;

    expect(formData.get('username')).toBe(payload.username);
    expect(formData.get('email')).toBe(payload.email);
    expect(formData.get('password')).toBe(payload.password);
    expect(formData.get('avatar')).toBeNull();

    request.flush(true);
  });

  it('should register user with avatar', () => {
    spectator = createService();

    const avatar = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    const payload: RegisterRequest = {
      username: 'new-user',
      email: 'user@example.com',
      password: 'TestPassword123!',
      avatar,
    };

    spectator.service.register(payload).subscribe((result) => {
      expect(result).toBe(true);
    });

    const request = spectator.expectOne('/api/auth/register', HttpMethod.POST);

    expect(request.request.body).toBeInstanceOf(FormData);

    const formData = request.request.body as FormData;

    expect(formData.get('username')).toBe(payload.username);
    expect(formData.get('email')).toBe(payload.email);
    expect(formData.get('password')).toBe(payload.password);
    expect(formData.get('avatar')).toBe(avatar);

    request.flush(true);
  });
});
