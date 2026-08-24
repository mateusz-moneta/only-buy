import { Role } from '@core/models';

export interface User {
  id: string;
  active: boolean;
  avatar: string | null;
  username: string;
  email: string;
  role: Role;
  createdDate: Date;
  updatedDate: Date;
}
