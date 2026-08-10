import { FormControl } from '@angular/forms';

export interface SearchForm {
  isActive: FormControl<boolean>;
  isPromo: FormControl<boolean>;
  phrase: FormControl<string>;
}
