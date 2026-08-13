import { UserData } from './user-data.model';

export interface RefreshUser extends UserData {
  accessToken: string;
}
