import { createSelector, createReducer, on, Action } from '@ngrx/store';
import { mergeRight, prop, propOr, pipe, sortWith, descend } from 'ramda';

import {
  RequestGamesAction,
  RequestGamesSuccessAction,
  RequestGamesFailedAction,
} from '@app-common/actions/games.actions';

export const initialState: QuestStat.Store.Games = {};

const reducer = createReducer(
  initialState,
  on(RequestGamesAction, state => mergeRight(state, { isLoading: true })),
  on(RequestGamesFailedAction, state => mergeRight(state, { isLoading: false })),
  on(RequestGamesSuccessAction, (state, { data }) => mergeRight(state, { isLoading: false, games: data })),
);

export function gameReducer(gamesState = initialState, action: Action): QuestStat.Store.Games {
  return reducer(gamesState, action);
}

export const selectGamesStore = (state: QuestStat.Store.State) => state.games;
export const getLoadingState = createSelector(
  selectGamesStore,
  (state: QuestStat.Store.Games) => prop('isLoading', state),
);
export const getGames = createSelector(
  selectGamesStore,
  pipe(
    propOr([], 'games'),
    sortWith([descend(prop('StartTime')), descend(prop('FinishTime'))]),
  ) as (data: QuestStat.Store.Games) => QuestStat.GameInfo[],
);
