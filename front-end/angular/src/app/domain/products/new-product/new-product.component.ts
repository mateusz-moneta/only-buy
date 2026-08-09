import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  CheckboxComponent,
  FilesUploaderComponent,
  InputComponent,
  TextareaComponent,
} from '@shared/components';
import { NgOptimizedImage } from '@angular/common';
import { NewProductFormBuilder } from './builders';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsStore } from '@core/state';

@Component({
  selector: 'app-new-product',
  imports: [
    ButtonComponent,
    CheckboxComponent,
    FilesUploaderComponent,
    InputComponent,
    NgOptimizedImage,
    ReactiveFormsModule,
    TextareaComponent,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewProductComponent {
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly form = NewProductFormBuilder.build();

  protected async goToDashboard(): Promise<void> {
    await this.router.navigate(['/']);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const { active, code, description, images, name, price, promo } =
      this.form.value;

    this.productsStore.createProduct({
      isActive: active ?? false,
      code: code ?? '',
      description: description ?? '',
      name: name ?? '',
      price: price ?? '0',
      isPromo: promo ?? false,
      productImages: images ?? [],
    });
  }
}
