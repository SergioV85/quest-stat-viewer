import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { SharedComponentsModule } from '@app-common/components/shared-components.module';
import { SharedServicesModule } from '@app-common/services/shared-services.module';
import { SharedPipesModule } from '@app-common/pipes/shared-pipes.module';

import { GameDataResolver } from '@app-common/services/resolvers/game-resolver.service';

import { GamePageComponent } from './game-page';
import { TotalTableComponent } from './total-table';
import { GameTableComponent } from './game-table';
import { TeamCardComponent } from './team-card/team-card.component';
import { LevelCardComponent } from './level-card/level-card.component';

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
    SharedServicesModule,
    SharedPipesModule,
  ],
  declarations: [GamePageComponent, TotalTableComponent, GameTableComponent, LevelCardComponent, TeamCardComponent],
})
export class GameViewModule {}
