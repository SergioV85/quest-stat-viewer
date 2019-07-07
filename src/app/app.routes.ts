import { Routes } from '@angular/router';
import { NoContentComponent } from './core/no-content';

export const ROUTES: Routes = [
  {
    path: ':domain/:id',
    loadChildren: () => import('./core/game').then(m => m.GameViewModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./core/games').then(m => m.GamesModule),
  },
  { path: '**', component: NoContentComponent },
];
