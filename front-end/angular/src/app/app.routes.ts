import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    canActivate: [guestGuard],
    path: 'login',
    loadComponent: () => import('./domain/login/login').then(({ Login }) => Login),
  },
  {
    canActivate: [authGuard],
    path: 'products',
    loadChildren: () =>
      import('./domain/products/products.routes').then(({ PRODUCTS_ROUTES }) => PRODUCTS_ROUTES),
  },
  {
    canActivate: [guestGuard],
    path: 'register',
    loadComponent: () => import('./domain/register/register').then(({ Register }) => Register),
  },
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () => import('./domain/dashboard/dashboard').then(({ Dashboard }) => Dashboard),
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./domain/not-found/not-found').then(({ NotFound }) => NotFound),
  },
];
