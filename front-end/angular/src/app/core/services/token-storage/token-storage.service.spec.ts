import { CookieService } from 'ngx-cookie-service';
import {
  SpectatorService,
  createServiceFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it, vi } from 'vitest';
import { TokenStorageService } from './token-storage.service';

describe(TokenStorageService.name, () => {
  let spectator: SpectatorService<TokenStorageService>;
  let cookieService: CookieService;

  const createService = createServiceFactory({
    service: TokenStorageService,
    mocks: [CookieService],
  });

  beforeEach(() => {
    spectator = createService();
    cookieService = spectator.inject(CookieService);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should set refresh token', () => {
    const token = 'refresh-token';

    spectator.service.setRefreshToken(token);

    expect(cookieService.set).toHaveBeenCalledWith('refreshToken', token, {
      path: '/',
      sameSite: 'Lax',
      secure: false,
    });
  });

  it('should get refresh token', () => {
    const token = 'refresh-token';

    vi.spyOn(cookieService, 'get').mockReturnValue(token);

    const result = spectator.service.getRefreshToken();

    expect(result).toBe(token);
    expect(cookieService.get).toHaveBeenCalledWith('refreshToken');
  });

  it('should return true when refresh token exists', () => {
    vi.spyOn(cookieService, 'check').mockReturnValue(true);

    const result = spectator.service.hasRefreshToken();

    expect(result).toBe(true);
    expect(cookieService.check).toHaveBeenCalledWith('refreshToken');
  });

  it('should return false when refresh token does not exist', () => {
    vi.spyOn(cookieService, 'check').mockReturnValue(false);

    const result = spectator.service.hasRefreshToken();

    expect(result).toBe(false);
    expect(cookieService.check).toHaveBeenCalledWith('refreshToken');
  });

  it('should remove refresh token', () => {
    spectator.service.removeRefreshToken();

    expect(cookieService.delete).toHaveBeenCalledWith('refreshToken', '/');
  });
});
