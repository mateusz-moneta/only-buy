import { Component, inject, OnInit } from '@angular/core';
import { AuthStore, ProductsStore } from '@core/state';
import {
  AvatarComponent,
  EmptyStateComponent,
  ProductComponent,
  SearchComponent,
} from './components';
import { ButtonComponent, CheckboxComponent, SpinnerComponent } from '@shared/components';
import { Router } from '@angular/router';
import { Product } from '@core/models';

@Component({
  selector: 'app-dashboard',
  imports: [
    AvatarComponent,
    ButtonComponent,
    CheckboxComponent,
    EmptyStateComponent,
    ProductComponent,
    SearchComponent,
    SpinnerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
})
export class DashboardComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly productsStore = inject(ProductsStore);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.authStore.isAuthenticated;
  protected readonly loading = this.productsStore.isLoading;
  protected readonly products = this.productsStore.products;
  protected readonly user = this.authStore.user;

  public ngOnInit(): void {
    this.productsStore.loadProducts();
  }

  protected onLogin(): void {
    this.redirectToLoginPage();
  }

  protected onLogout(): void {
    this.redirectToLoginPage();

    this.authStore.logout();
  }

  protected onShowDetails(product: Product): void {
    this.productsStore.selectProduct(product);

    this.router.navigate(['/products', product.id]);
  }

  private redirectToLoginPage(): void {
    this.router.navigate(['/login']);
  }
}
