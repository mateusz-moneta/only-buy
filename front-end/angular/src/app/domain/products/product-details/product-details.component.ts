import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStore } from '@core/state';
import { ButtonComponent, SpinnerComponent } from '@shared/components';
import { SafeHtmlPipe } from '@shared/pipes';
import { handleImageError } from '@shared/utils';

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

  protected readonly imageIndex = signal<number>(0);
  protected readonly loading = this.productsStore.isLoading;
  protected readonly product = this.productsStore.selectedProduct;

  protected readonly image = computed(() => {
    const images = this.product()?.images ?? [];
    const image = images[this.imageIndex()];

    if (image) {
      return image;
    }

    return null;
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

  protected onImageError(event: Event): void {
    handleImageError(event);
  }
}
