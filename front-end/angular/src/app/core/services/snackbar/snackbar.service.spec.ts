import {
  SpectatorService,
  createServiceFactory,
} from '@ngneat/spectator/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SnackbarService } from './snackbar.service';

describe(SnackbarService.name, () => {
  let spectator: SpectatorService<SnackbarService>;

  const createService = createServiceFactory(SnackbarService);

  beforeEach(() => {
    spectator = createService();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should show success snackbar', () => {
    spectator.service.success('Success message');

    expect(spectator.service.snackbar()).toEqual({
      message: 'Success message',
      type: 'success',
      duration: 3000,
    });
  });

  it('should show error snackbar', () => {
    spectator.service.error('Error message');

    expect(spectator.service.snackbar()).toEqual({
      message: 'Error message',
      type: 'error',
      duration: 5000,
    });
  });

  it('should show warning snackbar', () => {
    spectator.service.warning('Warning message');

    expect(spectator.service.snackbar()).toEqual({
      message: 'Warning message',
      type: 'warning',
      duration: 4000,
    });
  });

  it('should show info snackbar', () => {
    spectator.service.info('Info message');

    expect(spectator.service.snackbar()).toEqual({
      message: 'Info message',
      type: 'info',
      duration: 3000,
    });
  });

  it('should use custom duration', () => {
    spectator.service.success('Success message', 1000);

    expect(spectator.service.snackbar()).toEqual({
      message: 'Success message',
      type: 'success',
      duration: 1000,
    });
  });

  it('should close snackbar', () => {
    spectator.service.success('Success message');

    spectator.service.close();

    expect(spectator.service.snackbar()).toBeNull();
  });

  it('should automatically close snackbar after duration', () => {
    spectator.service.success('Success message', 3000);

    expect(spectator.service.snackbar()).not.toBeNull();

    vi.advanceTimersByTime(2999);

    expect(spectator.service.snackbar()).not.toBeNull();

    vi.advanceTimersByTime(1);

    expect(spectator.service.snackbar()).toBeNull();
  });

  it('should not automatically close snackbar when duration is 0', () => {
    spectator.service.success('Success message', 0);

    vi.advanceTimersByTime(10000);

    expect(spectator.service.snackbar()).toEqual({
      message: 'Success message',
      type: 'success',
      duration: 0,
    });
  });

  it('should not automatically close snackbar when duration is negative', () => {
    spectator.service.error('Error message', -1);

    vi.advanceTimersByTime(10000);

    expect(spectator.service.snackbar()).toEqual({
      message: 'Error message',
      type: 'error',
      duration: -1,
    });
  });

  it('should replace existing snackbar', () => {
    spectator.service.success('First message');

    spectator.service.error('Second message');

    expect(spectator.service.snackbar()).toEqual({
      message: 'Second message',
      type: 'error',
      duration: 5000,
    });
  });
});
