import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedComponentsModule } from '@app-common/components/shared-components.module';
import { SharedPipesModule } from '@app-common/pipes/shared-pipes.module';

import {
  GamePageComponent,
  GameTableComponent,
  LevelCardComponent,
  TeamCardComponent,
  TotalTableComponent,
} from './components';

import { gameDetailsReducer } from './reducers/game-details.reducer';
import { GameDetailsEffects } from './effects/game-details.effects';
import { GameDataResolver } from './resolvers/game-details/game-details.resolver';

export const routes: Route[] = [
  {
    path: '',
    component: GamePageComponent,
    resolve: {
      gameData: GameDataResolver,
    },
    children: [
      {
        path: 'total',
        component: TotalTableComponent,
      },
      {
        path: 'levels',
        component: GameTableComponent,
      },
      {
        path: 'teams',
        component: GameTableComponent,
      },
      {
        path: 'monitoring',
        loadChildren: () => import('./../monitoring').then(m => m.MonitoringModule),
      },
      {
        path: '',
        redirectTo: 'total',
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsModule,
    SharedPipesModule,
    StoreModule.forFeature('gameDetails', gameDetailsReducer),
    EffectsModule.forFeature([GameDetailsEffects]),
  ],
  declarations: [GamePageComponent, TotalTableComponent, GameTableComponent, LevelCardComponent, TeamCardComponent],
})
export class GameDetailsModule {}
