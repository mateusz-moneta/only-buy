import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime } from 'rxjs';
import { Product } from '@core/models';
import { AuthStore, ProductsStore } from '@core/state';
import {
  ButtonComponent,
  CheckboxComponent,
  PaginatorComponent,
  SpinnerComponent,
} from '@shared/components';
import { SearchFormBuilder } from './builders';
import {
  AvatarComponent,
  EmptyStateComponent,
  ProductComponent,
  SearchComponent,
} from './components';

@Component({
  selector: 'app-dashboard',
  imports: [
    AvatarComponent,
    ButtonComponent,
    CheckboxComponent,
    EmptyStateComponent,
    PaginatorComponent,
    ProductComponent,
    SearchComponent,
    SpinnerComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
})
export class DashboardComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authStore.isAuthenticated;
  protected readonly loading = this.productsStore.isLoading;
  protected readonly pageable = this.productsStore.pageable;
  protected readonly products = this.productsStore.products;
  protected readonly searchForm = SearchFormBuilder.build();
  protected readonly totalPages = this.productsStore.totalPages;
  protected readonly user = this.authStore.user;

  public ngOnInit(): void {
    this.productsStore.loadProducts({});
    this.handleForm();
  }

  protected onPageChange(page: number): void {
    this.productsStore.loadProducts({ page });
  }

  private handleForm(): void {
    this.searchForm.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        const { isActive, isPromo, phrase } = values;

        this.productsStore.loadProducts({
          isActive,
          isPromo,
          phrase,
        });
      });
  }

  protected onEditProduct(product: Product): void {
    this.productsStore.selectProduct(product);

    this.router.navigate(['/products', product.id, 'edit']);
  }

  protected onLogin(): void {
    this.redirectToLoginPage();
  }

  protected onLogout(): void {
    this.authStore.logout();
  }

  protected onRemoveProduct(productId: string): void {
    this.productsStore.deleteProduct({ productId });
  }

  protected onShowDetails(product: Product): void {
    this.productsStore.selectProduct(product);

    this.router.navigate(['/products', product.id]);
  }

  protected onSelectRates(product: Product, rating: number): void {
    if (product.rating) {
      this.productsStore.editProductRate({
        productId: product.id,
        rating,
      });

      return;
    }

    this.productsStore.createProductRate({
      productId: product.id,
      rating,
    });
  }

  private redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
