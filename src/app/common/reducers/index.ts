import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { gameReducer } from './games/games.reducer';
import { gameDetailsReducer } from './game-details/game-details.reducer';
import { monitoringReducer } from './monitoring/monitoring.reducer';

export const reducers: ActionReducerMap<QuestStat.Store.State> = {
  games: gameReducer,
  gameDetails: gameDetailsReducer,
  monitoring: monitoringReducer,
  router: routerReducer
};
