import { Actions, AuthAction } from './auth.actions';
import { User } from './models';

export interface AuthState {
  user: User | null;
  processing: boolean;
}

export const authInitialState: AuthState = {
  user: null,
  processing: false
};

export const authReducer = (state: AuthState = authInitialState, action: AuthAction) => {
  switch (action.type) {
    case Actions.LOGIN_USER:
      return {
        ...state,
        processing: true
      };

    case Actions.LOGIN_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        processing: false
      };

    case Actions.LOGIN_USER_FAIL:
      return {
        ...state,
        processing: false
      };

    case Actions.REGISTER_USER:
      return {
        ...state,
        processing: true
      };

    case Actions.REGISTER_USER_SUCCESS:
      return {
        ...state,
        processing: false
      };

    case Actions.REGISTER_USER_FAIL:
      return {
        ...state,
        processing: false
      };

    default:
      return state;
  }
};
