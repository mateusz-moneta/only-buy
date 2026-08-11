import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import {
  Login,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  Role,
} from '../models';
import { UserData } from '../models/user-data';
import { AuthService, TokenStorageService } from '../services';

export interface AuthUser {
  avatar: string | null;
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
  isLoading: true,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      router = inject(Router),
      tokenStorageService = inject(TokenStorageService)
    ) => ({
      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap((payload: LoginRequest) =>
            authService.login(payload).pipe(
              catchError(() => {
                tokenStorageService.removeRefreshToken();

                patchState(store, {
                  accessToken: null,
                  isAuthenticated: false,
                  user: null,
                });

                return EMPTY;
              })
            )
          ),
          tap((login: Login) => {
            tokenStorageService.setRefreshToken(login.refreshToken);

            patchState(store, {
              accessToken: login.accessToken,
              isAuthenticated: true,
              user: {
                avatar: login.avatar,
                role: login.role,
                username: login.username,
              },
            });

            router.navigate(['/']);
          })
        )
      ),
      logout: () => {
        tokenStorageService.removeRefreshToken();

        patchState(store, {
          accessToken: null,
          isAuthenticated: false,
        });
      },
      register: rxMethod<RegisterRequest>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap((payload: RegisterRequest) =>
            authService.register(payload).pipe(
              catchError(() => {
                patchState(store, {
                  isLoading: false,
                });

                return EMPTY;
              })
            )
          ),
          tap(() => {
            router.navigate(['/login']);
          })
        )
      ),
      refreshToken: rxMethod<RefreshTokenRequest>(
        pipe(
          tap(() => {
            patchState(store, {
              isLoading: true,
            });
          }),
          switchMap((payload: RefreshTokenRequest) =>
            authService.refreshToken(payload)
          ),
          tap((userData: UserData) => {
            patchState(store, {
              accessToken: userData.accessToken,
              isAuthenticated: true,
              isLoading: false,
              user: {
                avatar: userData.avatar,
                role: userData.role,
                username: userData.username,
              },
            });
          }),
          catchError(() => {
            tokenStorageService.removeRefreshToken();

            patchState(store, {
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              user: null,
            });

            return EMPTY;
          })
        )
      ),
    })
  )
);
