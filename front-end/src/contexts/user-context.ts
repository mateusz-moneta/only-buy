import { createContext } from 'react';
import { User } from '../models';

export const UserContext = createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  replaceAccessToken: (newAccessToken: string) => void;
}>({
  user: null,
  login: () => {
    return;
  },
  logout: () => {
    return;
  },
  replaceAccessToken: () => {
    return;
  }
});
