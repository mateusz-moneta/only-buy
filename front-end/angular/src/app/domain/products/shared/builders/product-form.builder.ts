import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '@core/models';
import { ProductForm } from '../models';

export class ProductFormBuilder {
  public static build(product?: Product): FormGroup<ProductForm> {
    return new FormGroup<ProductForm>({
      active: new FormControl(product?.isActive ?? false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      code: new FormControl(product?.code ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      description: new FormControl(product?.description ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      images: new FormControl([], {
        nonNullable: true,
        validators: product?.images?.length ? [] : [Validators.required],
      }),
      name: new FormControl(product?.name ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl(String(product?.price ?? ''), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      promo: new FormControl(product?.isPromo ?? false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
