import { SnackbarType } from './snackbar-type';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
  duration: number;
}
