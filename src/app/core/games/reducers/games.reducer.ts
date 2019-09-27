import { createSelector, createReducer, on, Action } from '@ngrx/store';
import { mergeRight, prop, propOr, pipe, sortWith, descend } from 'ramda';

import { GamesState, State, GameInfo } from '@app-common/models';
import {
  RequestGamesAction,
  RequestGamesSuccessAction,
  RequestGamesFailedAction,
} from '@app-core/games/actions/games.actions';

export const initialState: GamesState = {
  isLoading: false,
};

const reducer = createReducer(
  initialState,
  on(RequestGamesAction, state => mergeRight(state, { isLoading: true })),
  on(RequestGamesFailedAction, state => mergeRight(state, { isLoading: false })),
  on(RequestGamesSuccessAction, (state, { data }) => mergeRight(state, { isLoading: false, games: data })),
);

export function gamesReducer(gamesState = initialState, action: Action): GamesState {
  return reducer(gamesState, action);
}

export const selectGamesStore = (state: State) => state.games as GamesState;
export const getLoadingState = createSelector(
  selectGamesStore,
  prop('isLoading'),
);
export const getGames = createSelector(
  selectGamesStore,
  pipe(
    propOr([], 'games'),
    sortWith([descend(prop('StartTime')), descend(prop('FinishTime'))]),
  ) as (data: GamesState) => GameInfo[],
);
