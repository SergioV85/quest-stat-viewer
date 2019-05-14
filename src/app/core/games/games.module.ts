import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { SharedComponentsModule } from '@app-common/components/shared-components.module';
import { SharedPipesModule } from '@app-common/pipes/shared-pipes.module';
import { SharedServicesModule } from '@app-common/services/shared-services.module';

import { SavedGamesResolver } from '@app-common/services/resolvers/saved-games-resolver.service';

import { MainPageComponent } from './main-page';
import { SavedGamesComponent } from './saved-games';
import { SearchGameComponent } from './search-game';

export const routes: Route[] = [
  {
    path: '',
    component: MainPageComponent,
    resolve: {
      games: SavedGamesResolver,
    },
    pathMatch: 'full',
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
  declarations: [MainPageComponent, SavedGamesComponent, SearchGameComponent],
})
export class GamesModule {}
