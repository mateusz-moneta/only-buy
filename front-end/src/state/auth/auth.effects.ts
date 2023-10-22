import { Epic, combineEpics, ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { AuthAction, LOGIN_USER, LoginUser, loginUserFail, loginUserSuccess } from "./auth.actions";
import { LoginErrorPayload, LoginPayload } from './models';

const loginUser$ = (action$: ActionsObservable<AuthAction>): Epic<AuthAction> =>
    action$
        .pipe(
            ofType(LOGIN_USER),
            exhaustMap(({ payload }: AuthAction) =>
                ajax.getJSON<LoginPayload>('https://api.github.com/users/burczu/repos')
                    .pipe(
                        map((payload: LoginPayload) => loginUserSuccess(payload))
                    )
        );

export const authEffects = combineEpics(
    loginUser$
);

export default authEffects;
