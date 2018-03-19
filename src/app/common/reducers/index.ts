import { ActionReducerMap } from '@ngrx/store';
import { gameReducer } from './games/games.reducer';

export const reducers: ActionReducerMap<QuestStat.Store.State> = {
  games: gameReducer
};
