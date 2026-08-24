import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./new-product/new-product.component').then(
        ({ NewProductComponent }) => NewProductComponent
      ),
    providers: [provideTranslocoScope('new-product', 'products')],
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        loadComponent: () =>
          import('./edit-product/edit-product.component').then(
            ({ EditProductComponent }) => EditProductComponent
          ),
        providers: [provideTranslocoScope('edit-product', 'products')],
      },
      {
        path: '',
        loadComponent: () =>
          import('./product-details/product-details.component').then(
            ({ ProductDetailsComponent }) => ProductDetailsComponent
          ),
        providers: [provideTranslocoScope('product-details', 'products')],
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new',
  },
];
