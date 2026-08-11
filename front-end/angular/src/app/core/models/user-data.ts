import { Role } from './role';

export interface UserData {
  avatar: string;
  username: string;
  role: Role;
  accessToken: string;
}
