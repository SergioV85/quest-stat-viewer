import { createSelector, createReducer, on, Action } from '@ngrx/store';
import { mergeRight, prop, propOr, pipe, sortWith, descend } from 'ramda';

import { GamesState, State, GameInfo } from '@app-common/models';
import { GAMES_LIST_ACTIONS } from '@app-core/games/actions/games.actions';

export const initialState: GamesState = {
  isLoading: false,
};

const reducer = createReducer(
  initialState,
  on(GAMES_LIST_ACTIONS.requestGames, (state) => mergeRight(state, { isLoading: true })),
  on(GAMES_LIST_ACTIONS.requestGamesFailed, (state) => mergeRight(state, { isLoading: false })),
  on(GAMES_LIST_ACTIONS.requestGamesSuccess, (state, { data }) => mergeRight(state, { isLoading: false, games: data })),
);

export const gamesReducer = (gamesState: GamesState, action: Action): GamesState => reducer(gamesState, action);

export const selectGamesStore = (state: State) => state.games as GamesState;
export const getLoadingState = createSelector(selectGamesStore, prop('isLoading'));
export const getGames = createSelector(
  selectGamesStore,
  pipe(propOr([], 'games'), sortWith([descend(prop('StartTime')), descend(prop('FinishTime'))])) as (
    data: GamesState,
  ) => GameInfo[],
);
