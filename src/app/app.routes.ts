import { Routes } from '@angular/router';
import { NoContentComponent } from './core/no-content';

export const ROUTES: Routes = [
  {
    path: ':domain/:id',
    loadChildren: './core/game#GameViewModule'
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: './core/games#GamesModule'
  },
  { path: '**', component: NoContentComponent },
];
