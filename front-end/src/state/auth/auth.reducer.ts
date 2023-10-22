import { AuthAction, LOGIN_USER, LOGIN_USER_FAIL, LOGIN_USER_SUCCESS } from "./auth.actions";
import { User } from "./models";

interface AuthState {
    user: User | null;
    processing: boolean;
}

const initialState: AuthState = {
    user: null,
    processing: false
}

export const authReducer = (state: AuthState = initialState, { payload, type }: AuthAction) => {
    switch (type) {
        case LOGIN_USER:
            return {
                ...state,
                processing: true
            }

        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                user: payload,
                processing: false
            }
            
        case LOGIN_USER_FAIL:
            return {
                ...state,
                processing: false
            } 

        default:
            return state   
    }
}
