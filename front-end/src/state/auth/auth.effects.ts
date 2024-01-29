import {filter, Observable} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, switchMap } from 'rxjs/operators';

import {
    AuthActions,
    LoginUserAction,
    loginUserFail,
    loginUserSuccess,
    RegisterUserAction,
    registerUserSuccess
} from './auth.actions';
import {LoginSuccessPayload, RegisterSuccessPayload} from './models';

export const loginUser$ = (action$: Observable<LoginUserAction>) =>
  action$.pipe(
      filter(action => action.type === AuthActions.LOGIN_USER),
      switchMap((action: LoginUserAction) =>
      ajax
        .post<LoginSuccessPayload>('/api/login', action.payload)
        .pipe(map(({ response }) => loginUserSuccess(response)))
    )
  );

export const registerUser$ = (action$: Observable<RegisterUserAction>) =>
    action$.pipe(
        filter(action => action.type === AuthActions.REGISTER_USER),
        switchMap((action) =>
            ajax
                .post<RegisterSuccessPayload>(
                    '/api/register',
                    action.payload
                )
                .pipe(map(({ response }) => registerUserSuccess(response))
        )
    ));

export const authEffects = [loginUser$, registerUser$];

export default authEffects;
