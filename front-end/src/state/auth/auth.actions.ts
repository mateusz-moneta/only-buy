import { LoginPayload, LoginErrorPayload, LoginRequestPayload } from "./models";

export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAIL = 'LOGIN_USER_FAIL';

export type LOGIN_USER = typeof LOGIN_USER;
export type LOGIN_USER_SUCCESS = typeof LOGIN_USER_SUCCESS;
export type LOGIN_USER_FAIL = typeof LOGIN_USER_FAIL;

export interface LoginUser {
    type: LOGIN_USER,
    payload: LoginRequestPayload
}

export interface LoginUserSuccess {
    type: LOGIN_USER_SUCCESS,
    payload: LoginPayload
}

export interface LoginUserFail {
    type: LOGIN_USER_FAIL,
    payload: LoginPayload
}

export const loginUser = (payload: LoginRequestPayload) => ({
    type: LOGIN_USER,
    payload
});

export const loginUserSuccess = (payload: LoginPayload) => ({
    type: LOGIN_USER_SUCCESS,
    payload
});

export const loginUserFail = (payload: LoginErrorPayload) => ({
    type: LOGIN_USER_FAIL,
    payload
});

export type AuthAction = LoginUser | LoginUserSuccess | LoginUserFail;

export default {
    loginUser,
    loginUserSuccess,
    loginUserFail
}
