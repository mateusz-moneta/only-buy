import { Observable } from 'rxjs';
import { combineEpics, ofType } from 'redux-observable';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { Action } from 'redux';

import { LOGIN_USER, loginUserFail, loginUserSuccess } from "./auth.actions";
import { LoginErrorPayload, LoginPayload } from './models';

const loginUser$ = (action$: Observable<Action>) =>
    action$
        .pipe(
            ofType(LOGIN_USER),
            exhaustMap(({ payload }: Action extends { payload?: any }) =>
                ajax.getJSON<LoginPayload>('https://api.github.com/users/burczu/repos')
                    .pipe(
                        map((payload: LoginPayload) => loginUserSuccess(payload)),
                        catchError((error: string) => loginUserFail({
                            error
                        }))
                    )
        );

export const authEffects = combineEpics(
    loginUser$
);

export default authEffects;
