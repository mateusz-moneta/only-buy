import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent, SpinnerComponent } from '../../../shared/components';
import { ProductsStore } from '../../../core/state';

@Component({
  selector: 'app-product-details',
  imports: [ButtonComponent, SpinnerComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly loading = this.productsStore.isLoading;
  protected readonly product = this.productsStore.selectedProduct;

  protected async goToDashboard(): Promise<void> {
    await this.router.navigate(['/']);
  }
}
