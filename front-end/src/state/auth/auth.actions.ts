import {
  LoginFailPayload,
  LoginSuccessPayload,
  LoginRequestPayload,
  RegisterFailPayload,
  RegisterSuccessPayload,
  RegisterRequestPayload
} from './models';

const LOGIN_USER = 'LOGIN_USER';
const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL';

const REGISTER_USER = 'REGISTER_USER';
const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
const REGISTER_USER_FAIL = 'REGISTER_USER_FAIL';

export const Actions = {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL
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

export interface RegisterUserAction {
  type: typeof REGISTER_USER;
  payload: RegisterRequestPayload;
}

export interface RegisterUserSuccessAction {
  type: typeof REGISTER_USER_SUCCESS;
  payload: RegisterSuccessPayload;
}

export interface RegisterUserFailAction {
  type: typeof REGISTER_USER_FAIL;
  payload: RegisterFailPayload;
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

export const registerUser = (payload: RegisterRequestPayload): RegisterUserAction => ({
  type: REGISTER_USER,
  payload
});

export const registerUserSuccess = (
  payload: RegisterSuccessPayload
): RegisterUserSuccessAction => ({
  type: REGISTER_USER_SUCCESS,
  payload
});

export const registerUserFail = (payload: RegisterFailPayload): RegisterUserFailAction => ({
  type: REGISTER_USER_FAIL,
  payload
});

export type AuthAction =
  | LoginUserAction
  | LoginUserSuccessAction
  | LoginUserFailAction
  | RegisterUserAction
  | RegisterUserSuccessAction
  | RegisterUserFailAction;

export default {
  loginUser,
  loginUserSuccess,
  loginUserFail,
  registerUser,
  registerUserSuccess,
  registerUserFail
};
