import { signalStore, withState } from '@ngrx/signals';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthStore = signalStore({ providedIn: 'root' }, withState(initialState));
