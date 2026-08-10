import { FormControl } from '@angular/forms';

export interface SearchForm {
  isActive: FormControl<boolean>;
  isPromo: FormControl<boolean>;
  keyword: FormControl<string>;
}
