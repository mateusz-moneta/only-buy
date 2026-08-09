import { UserData } from './user-data';

export interface Login extends UserData {
  refreshToken: string;
}
