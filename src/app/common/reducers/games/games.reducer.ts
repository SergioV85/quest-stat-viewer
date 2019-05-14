import { createSelector } from '@ngrx/store';
import { merge, prop, propOr, pipe, sortWith, descend } from 'ramda';

import { GamesActions, GamesActionTypes } from '@app-common/actions/games.actions';

export const initialState: QuestStat.Store.Games = {};

export function gameReducer(gamesState = initialState, action: GamesActions): QuestStat.Store.Games {
  switch (action.type) {
    case GamesActionTypes.RequestGames: {
      return merge(gamesState, { isLoading: true });
    }
    case GamesActionTypes.RequestGamesComplete: {
      const games = action.payload;
      return merge(gamesState, { games, isLoading: false });
    }
    case GamesActionTypes.RequestGamesError: {
      return merge(gamesState, { isLoading: false });
    }
    default:
      return gamesState;
  }
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
