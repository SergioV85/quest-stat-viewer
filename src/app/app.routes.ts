import { Routes } from '@angular/router';
import { GameDataResolver } from './common/resolvers/game-resolver.service';
import { MainPageComponent } from './core/main-page';
import { GamePageComponent } from './core/game-page';
import { NoContentComponent } from './core/no-content';

export const ROUTES: Routes = [
  { path: '', component: MainPageComponent },
  {
    path: ':domain/:id',
    component: GamePageComponent,
    resolve: {
      gameData: GameDataResolver
    }
  },
  { path: '**', component: NoContentComponent },
];
