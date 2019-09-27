import { Routes } from '@angular/router';
import { NoContentComponent } from './core/no-content/no-content.component';

export const ROUTES: Routes = [
  {
    path: ':domain/:id',
    loadChildren: () => import('./core/game-details/game-details.module').then(m => m.GameDetailsModule),
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./core/games/games.module').then(m => m.GamesModule),
  },
  { path: '**', component: NoContentComponent },
];
