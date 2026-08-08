import { Component, inject, OnInit } from '@angular/core';
import { ProductsStore } from '../../core/state';
import { EmptyState, Product } from './components';
import { Spinner } from '../../shared/components';

@Component({
  selector: 'app-dashboard',
  imports: [EmptyState, Product, Spinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  standalone: true,
})
export class Dashboard implements OnInit {
  private readonly productsStore = inject(ProductsStore);

  protected readonly loading = this.productsStore.isLoading;
  protected readonly products = this.productsStore.products;

  public ngOnInit(): void {
    this.productsStore.loadProducts();
  }
}
