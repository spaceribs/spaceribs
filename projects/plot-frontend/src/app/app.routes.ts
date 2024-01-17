import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((mod) => mod.HomeComponent),
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./map/map.component').then((mod) => mod.MapComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
