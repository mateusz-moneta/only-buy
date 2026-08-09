import { Injectable, signal } from '@angular/core';
import { SnackbarData, SnackbarType } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly _snackbar = signal<SnackbarData | null>(null);

  public readonly snackbar = this._snackbar.asReadonly();

  public success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  public error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  public warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  public info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  public close(): void {
    this._snackbar.set(null);
  }

  private show(message: string, type: SnackbarType, duration: number): void {
    this._snackbar.set({
      message,
      type,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        this.close();
      }, duration);
    }
  }
}
