import { createSelector } from '@ngrx/store';
import { drop, merge, pick, prop, propOr, take } from 'ramda';

import * as GamesActions from '@app-common/actions/games.actions';

export const initialState: QuestStat.Store.Games = {};

export function gameReducer(gamesState = initialState, action: GamesActions.GamesActions): QuestStat.Store.Games {
  switch (action.type) {
    case GamesActions.GamesActionTypes.RequestGames: {
      return merge(gamesState, { isLoading: true });
    }
    case GamesActions.GamesActionTypes.RequestGamesComplete: {
      const games = action.payload;
      return merge(gamesState, { games, isLoading: false });
    }
    case GamesActions.GamesActionTypes.RequestGamesError: {
      return merge(gamesState, { isLoading: false });
    }
    default:
      return gamesState;
  }
}

export const selectGamesStore = (state: QuestStat.Store.State) => state.games;
export const getLoadingState = createSelector(selectGamesStore, (state: QuestStat.Store.Games) =>
  prop('isLoading', state)
);
export const getGames = createSelector(selectGamesStore, (state: QuestStat.Store.Games) =>
  propOr([], 'games', state) as QuestStat.GameInfo[]
);
