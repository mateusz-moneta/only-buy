import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () =>
      import('./new-product/new-product.component').then(
        ({ NewProductComponent }) => NewProductComponent,
      ),
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        loadComponent: () =>
          import('./edit-product/edit-product.component').then(
            ({ EditProductComponent }) => EditProductComponent,
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./product-details/product-details.component').then(
            ({ ProductDetailsComponent }) => ProductDetailsComponent,
          ),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new',
  },
];
