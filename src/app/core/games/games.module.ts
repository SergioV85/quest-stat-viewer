import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedComponentsModule } from '@app-common/components/shared-components.module';
import { SharedPipesModule } from '@app-common/pipes/shared-pipes.module';

import { GamesEffects } from './effects/games.effects';
import { gamesReducer } from './reducers/games.reducer';

import { MainPageComponent } from './components/main-page/main-page.component';
import { SavedGamesComponent } from './components/saved-games/saved-games.component';
import { SearchGameComponent } from './components/search-game/search-game.component';
import { SavedGamesResolver } from './resolvers/saved-games/saved-games.resolver';

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
    SharedPipesModule,
    StoreModule.forFeature('games', gamesReducer),
    EffectsModule.forFeature([GamesEffects]),
  ],
  declarations: [MainPageComponent, SavedGamesComponent, SearchGameComponent],
})
export class GamesModule {}
