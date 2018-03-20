import { createSelector } from '@ngrx/store';
import {
  ascend,
  complement,
  contains,
  descend,
  drop,
  dropLast,
  filter,
  head,
  length,
  map,
  merge,
  nth,
  path,
  pick,
  pipe,
  prop,
  propEq,
  propOr,
  sort,
  sortWith,
  sum,
  take,
  uniq
} from 'ramda';
import * as GameDetailsActions from '@app-common/actions/game-details.actions';

const getMatchedLevels = (selectedType, state) => pipe(
  path(['gameData', 'stat', 'Levels']),
  filter(propEq('type', selectedType)),
  filter(complement(prop('removed'))),
  map(prop('position'))
)(state);
const getCalculatedStat = (matchedLevels, team) => ({
  name: pipe(
    prop('data'),
    nth(0),
    prop('name')
  )(team) as string,
  id: pipe(
    prop('data'),
    nth(0),
    prop('id')
  )(team) as number,
  duration: pipe(
    prop('data'),
    filter((stat: QuestStat.TeamData) => contains(stat.levelIdx, matchedLevels)) as any,
    map(prop('duration')) as any,
    sum
  )(team) as number,
  closedLevels: pipe(
    prop('data'),
    length
  )(team)
});
const getPossibleLevelTypes = pipe(
  dropLast(1) as any,
  map(prop('type')),
  uniq,
  sort((a: number, b: number) => a - b) as any
);

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
      const gameData = action.payload;
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

export const _getGameData = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('gameData', state) as QuestStat.GameData
);
export const _getLevels = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('gameData', state) as QuestStat.GameData
);

