import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./domain/login/login').then(({ Login }) => Login),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./domain/products/products.routes').then(({ PRODUCTS_ROUTES }) => PRODUCTS_ROUTES),
  },
  {
    path: 'register',
    loadComponent: () => import('./domain/register/register').then(({ Register }) => Register),
  },
  {
    path: '',
    loadComponent: () => import('./domain/dashboard/dashboard').then(({ Dashboard }) => Dashboard),
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./domain/not-found/not-found').then(({ NotFound }) => NotFound),
  },
];
