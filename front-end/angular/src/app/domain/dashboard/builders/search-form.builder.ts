import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchForm } from '../models';

export class SearchFormBuilder {
  public static build(): FormGroup<SearchForm> {
    return new FormGroup<SearchForm>({
      isActive: new FormControl(false, {
        nonNullable: true,
      }),
      isPromo: new FormControl(false, {
        nonNullable: true,
      }),
      keyword: new FormControl('', {
        nonNullable: true,
      }),
    });
  }
}
