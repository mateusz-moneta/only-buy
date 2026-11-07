import { RegisterUser } from './register-user.model';

export interface User extends RegisterUser {
  id: string;
  active: boolean;
  avatar: string;
  role: string;
  createdDate: Date;
  updatedDate: Date;
}
