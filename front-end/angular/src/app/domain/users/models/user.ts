import { Role } from '@core/models';

export interface User {
  id: string;
  avatar: string;
  username: string;
  email: string;
  role: Role;
  createdDate: Date;
  updatedDate: Date;
}
