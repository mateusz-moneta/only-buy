import { Component, inject, OnInit } from '@angular/core';
import { AuthStore, ProductsStore } from '../../core/state';
import {
  AvatarComponent,
  EmptyStateComponent,
  ProductComponent,
  SearchComponent,
} from './components';
import { ButtonComponent, SpinnerComponent } from '../../shared/components';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    EmptyStateComponent,
    ProductComponent,
    SpinnerComponent,
    CheckboxComponent,
    AvatarComponent,
    ButtonComponent,
    SearchComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
})
export class DashboardComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly productsStore = inject(ProductsStore);

  protected readonly isAuthenticated = this.authStore.isAuthenticated;

  protected readonly loading = this.productsStore.isLoading;
  protected readonly products = this.productsStore.products;

  public ngOnInit(): void {
    this.productsStore.loadProducts();
  }
}
