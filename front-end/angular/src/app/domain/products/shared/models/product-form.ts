import { FormControl } from '@angular/forms';

export interface ProductForm {
  active: FormControl<boolean>;
  code: FormControl<string>;
  description: FormControl<string>;
  details: FormControl<string>;
  images: FormControl<File[]>;
  name: FormControl<string>;
  price: FormControl<string>;
  promo: FormControl<boolean>;
}
