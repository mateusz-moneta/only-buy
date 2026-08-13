import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { passwordMatchValidator } from './password-match.validator';

describe(passwordMatchValidator.name, () => {
  it('should return null when passwords match', () => {
    const form = new FormGroup({
      password: new FormControl('TestPassword123!'),
      repeatPassword: new FormControl('TestPassword123!'),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });

  it('should return passwordMismatch when passwords do not match', () => {
    const form = new FormGroup({
      password: new FormControl('TestPassword123!'),
      repeatPassword: new FormControl('DifferentPassword123!'),
    });

    expect(passwordMatchValidator(form)).toEqual({
      passwordMismatch: true,
    });
  });

  it('should return null when password is empty', () => {
    const form = new FormGroup({
      password: new FormControl(''),
      repeatPassword: new FormControl('TestPassword123!'),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });

  it('should return null when repeat password is empty', () => {
    const form = new FormGroup({
      password: new FormControl('TestPassword123!'),
      repeatPassword: new FormControl(''),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });

  it('should return null when both passwords are empty', () => {
    const form = new FormGroup({
      password: new FormControl(''),
      repeatPassword: new FormControl(''),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });

  it('should return null when password control does not exist', () => {
    const form = new FormGroup({
      repeatPassword: new FormControl('TestPassword123!'),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });

  it('should return null when repeatPassword control does not exist', () => {
    const form = new FormGroup({
      password: new FormControl('TestPassword123!'),
    });

    expect(passwordMatchValidator(form)).toBeNull();
  });
});
