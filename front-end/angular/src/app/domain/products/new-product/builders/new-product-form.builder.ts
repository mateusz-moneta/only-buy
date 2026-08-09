import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewProductForm } from '../models';

export class NewProductFormBuilder {
  public static build(): FormGroup<NewProductForm> {
    return new FormGroup<NewProductForm>({
      active: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      code: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      images: new FormControl([], {
        nonNullable: true,
        validators: [Validators.required],
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      promo: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
