import { createAction, props, union } from '@ngrx/store';
import { GameInfo } from '@app-common/models';

const requestGames = createAction('[Games] Request games');
const requestGamesSuccess = createAction('[Games] Games saved to store', props<{ data: GameInfo[] | null }>());
const requestGamesFailed = createAction('[Games] Request games failed', props<{ message?: string }>());

const actions = {
  requestGames,
  requestGamesFailed,
  requestGamesSuccess,
};

const gamesListActions = union(actions);

export type GamesListActionsType = typeof gamesListActions;

export const GAMES_LIST_ACTIONS = actions;
