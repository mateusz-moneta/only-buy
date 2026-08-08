import { Role } from './role';

export interface Login {
  username: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
}
