import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'query',
    loadComponent: () => import('./query/query.component').then(m => m.QueryComponent)
  },
  {
    path: 'collections',
    loadComponent: () => import('./collections/collections.component').then(m => m.CollectionsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
]; 