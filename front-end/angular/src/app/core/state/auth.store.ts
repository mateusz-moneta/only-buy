import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthService } from '../services';
import { pipe, switchMap, tap } from 'rxjs';
import { Login, LoginRequest, Role } from '../models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export interface AuthUser {
  username: string;
  role: Role;
}

export interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, authService = inject(AuthService)) => ({
    login: rxMethod<LoginRequest>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((payload: LoginRequest) => authService.login(payload)),
        tap((login: Login) => {
          patchState(store, {
            accessToken: login.accessToken,
            isAuthenticated: true,
            user: {
              role: login.role,
              username: login.username,
            },
          });
        }),
      ),
    ),
  })),
);
