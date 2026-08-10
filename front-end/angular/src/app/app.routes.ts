import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    canActivate: [guestGuard],
    path: 'login',
    loadComponent: () =>
      import('./domain/login/login.component').then(
        ({ LoginComponent }) => LoginComponent
      ),
  },
  {
    canActivate: [authGuard],
    path: 'products',
    loadChildren: () =>
      import('./domain/products/products.routes').then(
        ({ PRODUCTS_ROUTES }) => PRODUCTS_ROUTES
      ),
  },
  {
    canActivate: [guestGuard],
    path: 'register',
    loadComponent: () =>
      import('./domain/register/register.component').then(
        ({ RegisterComponent }) => RegisterComponent
      ),
  },
  {
    canActivate: [adminGuard],
    path: 'users',
    loadComponent: () =>
      import('./domain/users/users.component').then(
        ({ UsersComponent }) => UsersComponent
      ),
  },
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () =>
      import('./domain/dashboard/dashboard.component').then(
        ({ DashboardComponent }) => DashboardComponent
      ),
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./domain/not-found/not-found.component').then(
        ({ NotFoundComponent }) => NotFoundComponent
      ),
  },
];
