import { Action } from 'redux';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Actions, loginUserSuccess } from './auth.actions';

const loginUser$ = (action$: Observable<Action<any>>) =>
  action$.pipe(
    ofType(Actions.LOGIN_USER),
    map(() =>
      loginUserSuccess({
        username: 'Test'
      })
    )
  );

export const authEffects = [loginUser$];

export default authEffects;
