import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { UpdateActive, User } from '../models';
import { UsersService } from '../services';

export interface UsersState {
  isLoading: boolean;
  users: User[];
}

const initialState: UsersState = {
  isLoading: false,
  users: [],
};

export const UsersStore = signalStore(
  withState(initialState),
  withMethods((store, usersService = inject(UsersService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, {
            isLoading: true,
          });
        }),
        switchMap(() => usersService.getUsers()),
        tap((users: User[]) => {
          patchState(store, {
            users,
            isLoading: false,
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
            users: store.users().map((currentUser: User) => {
              if (currentUser.id === user.id) {
                return user;
              }

              return currentUser;
            }),
            isLoading: false,
          });
        })
      )
    ),
  }))
);
