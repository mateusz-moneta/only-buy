import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '@core/state';
import { SnackbarService } from '../../services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized: {
          if (authStore.isAuthenticated()) {
            authStore.logout();
            router.navigate(['/']);

            snackbarService.error(
              'Your session has expired. Please log in again.'
            );
          } else {
            snackbarService.error(
              error.error.message ?? 'Invalid credentials.'
            );
          }

          break;
        }

        case HttpStatusCode.Forbidden:
          snackbarService.error(
            'You do not have permission to perform this action.'
          );
          break;

        case HttpStatusCode.NotFound:
          snackbarService.error('The requested resource was not found.');
          break;

        case HttpStatusCode.InternalServerError:
          snackbarService.error('An unexpected server errors occurred.');
          break;

        default:
          snackbarService.error('Something went wrong. Please try again.');
          break;
      }

      return throwError(() => error);
    })
  );
};
