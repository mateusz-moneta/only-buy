import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStore } from '@core/state';
import {
  ButtonComponent,
  CheckboxComponent,
  FilesUploaderComponent,
  InputComponent,
  SpinnerComponent,
  TextareaComponent,
} from '@shared/components';
import { ProductFormBuilder } from '../shared/builders';
import { ProductForm } from '../shared/models';

@Component({
  selector: 'app-edit-product',
  imports: [
    ButtonComponent,
    CheckboxComponent,
    FilesUploaderComponent,
    InputComponent,
    NgOptimizedImage,
    ReactiveFormsModule,
    TextareaComponent,
    SpinnerComponent,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  standalone: true,
})
export class EditProductComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly form = signal<FormGroup<ProductForm> | null>(null);
  protected readonly loading = this.productsStore.isLoading;
  protected readonly product = this.productsStore.selectedProduct;

  private readonly initFormEffect = effect(() => {
    const product = this.product();

    if (product) {
      this.form.set(ProductFormBuilder.build(product));
      this.initFormEffect.destroy();
    }
  });

  public ngOnInit(): void {
    if (!this.product()) {
      this.productsStore.loadProduct({
        id: this.activatedRoute.snapshot.params['id'],
      });
    }
  }

  protected async goToDashboard(): Promise<void> {
    await this.router.navigate(['/']);
  }

  protected onProductImagesChange(images: File[]): void {
    this.form()?.controls.images.setValue(images, { emitEvent: false });
  }

  protected onSubmit(): void {
    if (this.form()?.invalid) {
      this.form()?.markAllAsTouched();

      return;
    }

    const { active, code, description, images, name, price, promo } =
      this.form()?.value ?? {};

    const { id } = this.product() ?? {};

    if (!id) {
      return;
    }

    this.productsStore.editProduct({
      id,
      payload: {
        isActive: active ?? false,
        code: code ?? '',
        description: description ?? '',
        name: name ?? '',
        price: price ?? '0',
        isPromo: promo ?? false,
        productImages: images ?? [],
      },
    });

    // this.router.navigate(['/']);
  }
}
