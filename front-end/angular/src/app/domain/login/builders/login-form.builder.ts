import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '../models';

export class LoginFormBuilder {
  public static build(): FormGroup<LoginForm> {
    return new FormGroup<LoginForm>({
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
