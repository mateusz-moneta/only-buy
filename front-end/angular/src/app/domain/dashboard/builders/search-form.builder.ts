import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchForm } from '../models';

export class SearchFormBuilder {
  public static build(
    isActive = false,
    isPromo = false,
    phrase = ''
  ): FormGroup<SearchForm> {
    return new FormGroup<SearchForm>({
      isActive: new FormControl(isActive, {
        nonNullable: true,
      }),
      isPromo: new FormControl(isPromo, {
        nonNullable: true,
      }),
      phrase: new FormControl(phrase, {
        nonNullable: true,
      }),
    });
  }
}
