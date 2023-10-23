import { LoginFailPayload, LoginSuccessPayload, LoginRequestPayload } from './models';

const LOGIN_USER = 'LOGIN_USER';
const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL';

export const Actions = {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL
};

export interface LoginUserAction {
  type: typeof LOGIN_USER;
  payload: LoginRequestPayload;
}

export interface LoginUserSuccessAction {
  type: typeof LOGIN_USER_SUCCESS;
  payload: LoginSuccessPayload;
}

export interface LoginUserFailAction {
  type: typeof LOGIN_USER_FAIL;
  payload: LoginFailPayload;
}

export const loginUser = (payload: LoginRequestPayload): LoginUserAction => ({
  type: LOGIN_USER,
  payload
});

export const loginUserSuccess = (payload: LoginSuccessPayload): LoginUserSuccessAction => ({
  type: LOGIN_USER_SUCCESS,
  payload
});

export const loginUserFail = (payload: LoginFailPayload): LoginUserFailAction => ({
  type: LOGIN_USER_FAIL,
  payload
});

export type AuthAction = LoginUserAction | LoginUserSuccessAction | LoginUserFailAction;

export default {
  loginUser,
  loginUserSuccess,
  loginUserFail
};
