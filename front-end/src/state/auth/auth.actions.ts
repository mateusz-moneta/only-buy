import {
  LoginFailPayload,
  LoginPayload,
  LoginSuccessPayload,
  RegisterFailPayload,
  RegisterPayload,
  RegisterSuccessPayload
} from './models';

const LOGIN_USER = '[Auth] Login user';
const LOGIN_USER_SUCCESS = '[Auth] Login user success';
const LOGIN_USER_FAIL = '[Auth] Login user fail';

const REGISTER_USER = '[Auth] Register user';
const REGISTER_USER_SUCCESS = '[Auth] Register user success';
const REGISTER_USER_FAIL = '[Auth] Register user fail';

export const AuthActions = {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL
};

export interface LoginUserAction {
  type: typeof LOGIN_USER;
  payload: LoginPayload;
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
  payload: RegisterPayload;
}

export interface RegisterUserSuccessAction {
  type: typeof REGISTER_USER_SUCCESS;
  payload: RegisterSuccessPayload;
}

export interface RegisterUserFailAction {
  type: typeof REGISTER_USER_FAIL;
  payload: RegisterFailPayload;
}

export const loginUser = (payload: LoginPayload): LoginUserAction => ({
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

export const registerUser = (payload: RegisterPayload): RegisterUserAction => ({
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
