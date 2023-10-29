import { Action } from 'redux';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthActions, loginUserFail, loginUserSuccess, registerUserSuccess } from './auth.actions';
import { LoginSuccessPayload, RegisterSuccessPayload } from './models';

const loginUser$ = (action$: Observable<Action<any>>) =>
  action$.pipe(
    ofType(AuthActions.LOGIN_USER),
    switchMap(() =>
      ajax
        .getJSON('https://api.github.com/users?per_page=5')
        .pipe(map((payload) => loginUserSuccess(payload as LoginSuccessPayload)))
    )
  );

const registerUser$ = (action$: Observable<Action<any>>) =>
  action$.pipe(
    ofType(AuthActions.REGISTER_USER),
    switchMap(() =>
      ajax
        .getJSON('https://api.github.com/users?per_page=5')
        .pipe(map((payload) => registerUserSuccess(payload as RegisterSuccessPayload)))
    )
  );

export const authEffects = [loginUser$];

export default authEffects;
