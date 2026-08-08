import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button, Spinner } from '../../../shared/components';
import { ProductsStore } from '../../../core/state';

@Component({
  selector: 'app-product-details',
  imports: [Button, Spinner],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  standalone: true,
})
export class ProductDetails {
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly loading = this.productsStore.isLoading;
  protected readonly product = this.productsStore.selectedProduct;

  protected async goToDashboard(): Promise<void> {
    await this.router.navigate(['/']);
  }
}
