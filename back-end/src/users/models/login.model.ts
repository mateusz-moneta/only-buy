import { UserData } from './user-data.model';

export interface Login extends UserData {
  refreshToken: string;
}
