import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it, vi } from 'vitest';
import { AuthStore } from '../../state';
import { authInterceptor } from './auth.interceptor';

class TestService {}

describe(authInterceptor.name, () => {
  let spectator: SpectatorHttp<TestService>;

  const accessToken = vi.fn();

  const createService = createHttpFactory({
    service: TestService,
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
      {
        provide: AuthStore,
        useValue: {
          accessToken,
        },
      },
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should forward request without authorization header when access token does not exist', () => {
    accessToken.mockReturnValue(null);

    spectator = createService();

    spectator.inject(HttpClient).get('/api/products').subscribe();

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    expect(request.request.headers.has('Authorization')).toBe(false);

    request.flush([]);
  });

  it('should add authorization header when access token exists', () => {
    accessToken.mockReturnValue('test-access-token');

    spectator = createService();

    spectator.inject(HttpClient).get('/api/products').subscribe();

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer test-access-token'
    );

    request.flush([]);
  });

  it('should call authStore accessToken', () => {
    accessToken.mockReturnValue('test-access-token');

    spectator = createService();

    spectator.inject(HttpClient).get('/api/products').subscribe();

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    expect(accessToken).toHaveBeenCalledTimes(1);

    request.flush([]);
  });
});
