import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterForm } from '../models';
import { passwordMatchValidator } from '@core/validators';

export class RegisterFormBuilder {
  public static build(): FormGroup<RegisterForm> {
    return new FormGroup<RegisterForm>(
      {
        avatar: new FormControl(null),
        email: new FormControl('', {
          nonNullable: true,
          validators: [Validators.email, Validators.required],
        }),
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        repeatPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        username: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      {
        validators: passwordMatchValidator,
      },
    );
  }
}
