import { FormControl } from '@angular/forms';

export interface RegisterForm {
  avatar: FormControl<File | null>;
  email: FormControl<string>;
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
  username: FormControl<string>;
}
