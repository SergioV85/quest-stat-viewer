import { createSelector } from '@ngrx/store';
import {
  ascend,
  curry,
  descend,
  head,
  map,
  merge,
  mergeDeepRight,
  path,
  pipe,
  prop,
  sortWith,
  uniq
} from 'ramda';
import * as GameDetailsActions from '@app-common/actions/game-details.actions';
import {
  appendFinishStat,
  appendFinishStatToTeam,
  getCalculatedStat,
  getMatchedLevels,
  getPossibleLevelTypes,
  sortFinishResults,
  sortTeamList
} from './game-details.helpers';

export const initialState: QuestStat.Store.GameDetails = {
  isLoading: false
};

export function gameDetailsReducer(gameDetailsState = initialState, action: GameDetailsActions.GameDetailsActions) {
  switch (action.type) {
    case GameDetailsActions.GameDetailsActionTypes.ChangeTotalStatTab: {
      const selectedTotalTab = action.payload;
      return merge(gameDetailsState, { selectedTotalTab });
    }
    case GameDetailsActions.GameDetailsActionTypes.CleanGameData: {
      return initialState;
    }
    case GameDetailsActions.GameDetailsActionTypes.RequestGameDetails: {
      return merge(gameDetailsState, { isLoading: true });
    }
    case GameDetailsActions.GameDetailsActionTypes.RequestGameDetailsComplete: {
      const serverGameData = action.payload;
      const gameData = mergeDeepRight(serverGameData, {
        stat: {
          FinishResults: sortFinishResults(serverGameData.stat.FinishResults)
        }
      });
      const selectedTotalTab = pipe(
        path(['stat', 'Levels']),
        getPossibleLevelTypes,
        head
      )(gameData);
      return merge(gameDetailsState, { gameData, isLoading: false, selectedTotalTab });
    }
    case GameDetailsActions.GameDetailsActionTypes.RequestGameDetailsError: {
      return merge(gameDetailsState, { isLoading: false });
    }
    default:
      return gameDetailsState;
  }
}

/* Selectors */

export const selectGameDetailsStore = (state: QuestStat.Store.State) => state.gameDetails;
export const getActiveTabOnTotalStatState = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('selectedTotalTab', state)
);
export const getAvailableLevelTypes = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  pipe(
    path(['gameData', 'stat', 'Levels']),
    getPossibleLevelTypes
  )(state) as number[]
);
export const getFinishResults = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  path(['gameData', 'stat', 'FinishResults'], state) as QuestStat.TeamData[]
);
export const getLevels = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  path(['gameData', 'stat', 'Levels'], state) as QuestStat.LevelData[]
);
export const getLoadingState = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('isLoading', state)
);
export const getSortedTeamsTotalResulst = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) => {
  const selectedType = prop('selectedTotalTab', state);
  const matchedLevels = getMatchedLevels(selectedType, state);
  const calculatedStat = (team) => getCalculatedStat(matchedLevels, team);

  return pipe(
    path(['gameData', 'stat', 'DataByTeam']),
    map(calculatedStat),
    sortWith([
      descend(prop('closedLevels')),
      ascend(prop('duration'))
    ])
  )(state);
});
export const getStatData = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) => {
  const levels = pipe(
    path(['gameData', 'stat', 'DataByLevelsRow']),
    curry(appendFinishStat)(state.gameData.stat.FinishResults)
  )(state) as QuestStat.TeamData[][];
  const teams = pipe(
    path(['gameData', 'stat', 'DataByTeam']),
    curry(sortTeamList)(state.gameData.stat.FinishResults) as any,
    curry(appendFinishStatToTeam)(state.gameData.stat.FinishResults) as any,
    map(prop('data'))
  )(state) as QuestStat.TeamData[][];

  return {
    levels,
    teams
  };
});

export const _getGameData = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('gameData', state) as QuestStat.GameData
);
