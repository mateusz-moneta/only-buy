import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: 'new',
    loadComponent: () => import('./new-product/new-product').then(({ NewProduct }) => NewProduct),
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        loadComponent: () =>
          import('./edit-product/edit-product').then(({ EditProduct }) => EditProduct),
      },
      {
        path: '',
        loadComponent: () =>
          import('./product-details/product-details').then(({ ProductDetails }) => ProductDetails),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new',
  },
];
