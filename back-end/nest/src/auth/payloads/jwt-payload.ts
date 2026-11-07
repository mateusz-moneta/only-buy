import { Role } from '../../users/models';

export type JwtPayload = {
  sub: string;
  username: string;
  role: Role;
};
