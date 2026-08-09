import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../../services';
import { AuthStore } from '@core/state';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401: {
          if (authStore.isAuthenticated()) {
            authStore.logout();
            router.navigate(['/login']);

            snackbarService.error(
              'Your session has expired. Please log in again.',
            );
          } else {
            snackbarService.error(
              error.error.message ?? 'Invalid credentials.',
            );
          }

          break;
        }

        case 403:
          snackbarService.error(
            'You do not have permission to perform this action.',
          );
          break;

        case 404:
          snackbarService.error('The requested resource was not found.');
          break;

        case 500:
          snackbarService.error('An unexpected server errors occurred.');
          break;

        default:
          snackbarService.error('Something went wrong. Please try again.');
          break;
      }

      return throwError(() => error);
    }),
  );
};
