import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, SpinnerComponent } from '@shared/components';
import { ProductsStore } from '@core/state';
import { NgOptimizedImage } from '@angular/common';
import { SafeHtmlPipe } from '@shared/pipes';

@Component({
  selector: 'app-product-details',
  imports: [ButtonComponent, NgOptimizedImage, SafeHtmlPipe, SpinnerComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly loading = this.productsStore.isLoading;
  protected readonly product = this.productsStore.selectedProduct;

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
}
