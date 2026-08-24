import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@core/constants';
import { Page, Pageable } from '@core/models';
import { UpdateActive, User } from '../models';
import { UsersService } from '../services';

export interface UsersState {
  isLoading: boolean;
  pageable: Pageable;
  totalPages: number;
  users: User[];
}

const initialState: UsersState = {
  isLoading: false,
  pageable: {
    page: DEFAULT_PAGE,
    size: DEFAULT_PAGE_SIZE,
  },
  totalPages: 0,
  users: [],
};

export const UsersStore = signalStore(
  withState(initialState),
  withMethods((store, usersService = inject(UsersService)) => ({
    loadUsers: rxMethod<Partial<{ page: number }>>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(({ page }) => usersService.getUsers(page)),
        tap(({ data: users, page, totalPages }: Page<User>) => {
          patchState(store, {
            isLoading: false,
            totalPages,
            pageable: {
              ...store.pageable(),
              page,
            },
            users,
          });
        })
      )
    ),
    updateUserActive: rxMethod<UpdateActive>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap((payload: UpdateActive) =>
          usersService.updateUserActive(payload)
        ),
        tap((user: User) => {
          patchState(store, {
            isLoading: false,
            users: store.users().map((currentUser: User) => {
              if (currentUser.id === user.id) {
                return user;
              }

              return currentUser;
            }),
          });
        })
      )
    ),
  }))
);
