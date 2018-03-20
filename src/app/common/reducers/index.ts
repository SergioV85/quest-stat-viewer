import { ActionReducerMap } from '@ngrx/store';
import { gameReducer } from './games/games.reducer';
import { gameDetailsReducer } from './game-details/game-details.reducer';

export const reducers: ActionReducerMap<QuestStat.Store.State> = {
  games: gameReducer,
  gameDetails: gameDetailsReducer
};
