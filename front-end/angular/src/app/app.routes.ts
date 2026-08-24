import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { adminGuard, authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    canActivate: [guestGuard],
    path: 'login',
    loadComponent: () =>
      import('./domain/login/login.component').then(
        ({ LoginComponent }) => LoginComponent
      ),
    providers: [provideTranslocoScope('login')],
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
    providers: [provideTranslocoScope('register')],
  },
  {
    canActivate: [adminGuard],
    path: 'users',
    loadComponent: () =>
      import('./domain/users/users.component').then(
        ({ UsersComponent }) => UsersComponent
      ),
    providers: [provideTranslocoScope('users')],
  },
  {
    path: '',
    loadComponent: () =>
      import('./domain/dashboard/dashboard.component').then(
        ({ DashboardComponent }) => DashboardComponent
      ),
    pathMatch: 'full',
    providers: [provideTranslocoScope('dashboard')],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./domain/not-found/not-found.component').then(
        ({ NotFoundComponent }) => NotFoundComponent
      ),
    providers: [provideTranslocoScope('notFound')],
  },
];
