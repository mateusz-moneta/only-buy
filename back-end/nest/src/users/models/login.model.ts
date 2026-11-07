import { RefreshUser } from './refresh-user.model';

export interface Login extends RefreshUser {
  refreshToken: string;
}
