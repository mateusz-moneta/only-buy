import { Role } from './role';

export interface UserData {
  username: string;
  role: Role;
  accessToken: string;
}
