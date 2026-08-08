import { inject } from '@angular/core';
import { AuthStore } from '../../state';
import { EMPTY, filter, Observable, take } from 'rxjs';
import { TokenStorageService } from '../../services';
import { toObservable } from '@angular/core/rxjs-interop';

export function appInitializer(): Observable<boolean> {
  const authStore = inject(AuthStore);
  const tokenStorageService = inject(TokenStorageService);

  const refreshToken = tokenStorageService.getRefreshToken();

  if (!refreshToken) {
    return EMPTY;
  }

  authStore.refreshToken({
    refreshToken,
  });

  return toObservable(authStore.isLoading).pipe(
    filter((isLoading: boolean) => !isLoading),
    take(1),
  );
}
