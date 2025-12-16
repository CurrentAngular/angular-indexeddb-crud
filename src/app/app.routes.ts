import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'add',
    loadComponent: () => import('./components/add-contact/add-contact').then((m) => m.AddContact),
  },
  {
    path: 'delete',
    loadComponent: () =>
      import('./components/delete-contact/delete-contact').then((m) => m.DeleteContact),
  },
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
  {
    path: '**',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
];
