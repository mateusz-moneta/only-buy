import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, filter, take } from 'rxjs';
import { TokenStorageService } from '../../services';
import { AuthStore } from '../../state';

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
    take(1)
  );
}
