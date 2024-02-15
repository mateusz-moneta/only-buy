import { createContext } from 'react';

export const AlertContext = createContext<{
  alertMessage: string;
  showAlert: boolean;
  cleanMessage: () => void;
  close: () => void;
  open: () => void;
  writeMessage: (value: string) => void;
}>({
  alertMessage: '',
  showAlert: false,
  cleanMessage: () => {
    return;
  },
  close: () => {
    return;
  },
  open: () => {
    return;
  },
  writeMessage: (value: string) => {
    return;
  }
});
