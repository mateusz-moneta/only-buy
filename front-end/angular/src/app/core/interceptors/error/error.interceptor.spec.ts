import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthStore } from '@core/state';
import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/vitest';
import { describe, expect, it, vi } from 'vitest';
import { SnackbarService } from '../../services';
import { errorInterceptor } from './error.interceptor';

describe(errorInterceptor.name, () => {
  let spectator: SpectatorHttp<object>;

  const isAuthenticated = vi.fn();
  const logout = vi.fn();
  const navigate = vi.fn();
  const snackbarError = vi.fn();

  const createService = createHttpFactory({
    service: class {},
    providers: [
      provideHttpClient(withInterceptors([errorInterceptor])),
      provideHttpClientTesting(),
      {
        provide: AuthStore,
        useValue: {
          isAuthenticated,
          logout,
        },
      },
      {
        provide: Router,
        useValue: {
          navigate,
        },
      },
      {
        provide: SnackbarService,
        useValue: {
          error: snackbarError,
        },
      },
    ],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle unauthorized error for authenticated user', () => {
    isAuthenticated.mockReturnValue(true);

    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/products')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(HttpStatusCode.Unauthorized);
        },
      });

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    request.flush(
      {
        message: 'Unauthorized',
      },
      {
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
      }
    );

    expect(logout).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(['/login']);

    expect(snackbarError).toHaveBeenCalledWith(
      'Your session has expired. Please log in again.'
    );
  });

  it('should handle unauthorized error for unauthenticated user', () => {
    isAuthenticated.mockReturnValue(false);

    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/products')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(HttpStatusCode.Unauthorized);
        },
      });

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    request.flush(
      {
        message: 'Invalid credentials.',
      },
      {
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
      }
    );

    expect(logout).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();

    expect(snackbarError).toHaveBeenCalledWith('Invalid credentials.');
  });

  it('should use default message for unauthorized error without message', () => {
    isAuthenticated.mockReturnValue(false);

    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/products')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(HttpStatusCode.Unauthorized);
        },
      });

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    request.flush(
      {},
      {
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
      }
    );

    expect(snackbarError).toHaveBeenCalledWith('Invalid credentials.');
  });

  it('should handle forbidden error', () => {
    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/users')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(HttpStatusCode.Forbidden);
        },
      });

    const request = spectator.expectOne('/api/users', HttpMethod.GET);

    request.flush(
      {},
      {
        status: HttpStatusCode.Forbidden,
        statusText: 'Forbidden',
      }
    );

    expect(snackbarError).toHaveBeenCalledWith(
      'You do not have permission to perform this action.'
    );
  });

  it('should handle not found error', () => {
    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/products/unknown')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(HttpStatusCode.NotFound);
        },
      });

    const request = spectator.expectOne(
      '/api/products/unknown',
      HttpMethod.GET
    );

    request.flush(
      {},
      {
        status: HttpStatusCode.NotFound,
        statusText: 'Not Found',
      }
    );

    expect(snackbarError).toHaveBeenCalledWith(
      'The requested resource was not found.'
    );
  });

  it('should handle internal server error', () => {
    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/products')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(HttpStatusCode.InternalServerError);
        },
      });

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    request.flush(
      {},
      {
        status: HttpStatusCode.InternalServerError,
        statusText: 'Internal Server Error',
      }
    );

    expect(snackbarError).toHaveBeenCalledWith(
      'An unexpected server errors occurred.'
    );
  });

  it('should handle unknown error', () => {
    spectator = createService();

    spectator
      .inject(HttpClient)
      .get('/api/products')
      .subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(418);
        },
      });

    const request = spectator.expectOne('/api/products', HttpMethod.GET);

    request.flush(
      {},
      {
        status: 418,
        statusText: "I'm a teapot",
      }
    );

    expect(snackbarError).toHaveBeenCalledWith(
      'Something went wrong. Please try again.'
    );
  });
});
