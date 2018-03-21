import { createSelector } from '@ngrx/store';
import {
  adjust,
  ascend,
  curry,
  descend,
  equals,
  find,
  head,
  map,
  merge,
  mergeDeepRight,
  path,
  pipe,
  prop,
  propEq,
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
  sortTeamList,
  updateFinishStat,
  updateLevels,
  updateStatByLevel,
  updateStatByTeams
} from './game-details.helpers';

export const initialState: QuestStat.Store.GameDetails = {
  isLoading: false
};

export function gameDetailsReducer(gameDetailsState = initialState, action: GameDetailsActions.GameDetailsActions) {
  switch (action.type) {
    case GameDetailsActions.GameDetailsActionTypes.ChangeLevelType: {
      const updatedLevel = action.payload;
      const currentLevels = prop('levels', gameDetailsState) as QuestStat.LevelData[];
      const levels = updateLevels(updatedLevel, currentLevels);

      return merge(gameDetailsState, { levels });
    }
    case GameDetailsActions.GameDetailsActionTypes.ChangeTotalStatTab: {
      const selectedTotalTab = action.payload;
      return merge(gameDetailsState, { selectedTotalTab });
    }
    case GameDetailsActions.GameDetailsActionTypes.CleanGameData: {
      return initialState;
    }
    case GameDetailsActions.GameDetailsActionTypes.RemoveLevelFromStat: {
      const removedLevel = action.payload;

      const currentLevels = prop('levels', gameDetailsState) as QuestStat.LevelData[];
      const currentStatByLevels = prop('dataByLevels', gameDetailsState) as QuestStat.TeamData[][];
      const currentStatByTeams = prop('dataByTeam', gameDetailsState) as QuestStat.GroupedTeamData[];
      const currentFinishResulst = prop('finishResults', gameDetailsState) as QuestStat.TeamData[];

      const levels = updateLevels(removedLevel, currentLevels);

      const newLevel = find(propEq('level', removedLevel.level), levels);

      const dataByLevels = updateStatByLevel(newLevel, currentStatByLevels);
      const dataByTeam = updateStatByTeams(newLevel, currentStatByTeams);
      const finishResults = updateFinishStat(newLevel, dataByTeam, currentFinishResulst);

      return merge(gameDetailsState, { levels, dataByLevels, dataByTeam, finishResults });
    }
    case GameDetailsActions.GameDetailsActionTypes.RequestGameDetails: {
      return merge(gameDetailsState, { isLoading: true });
    }
    case GameDetailsActions.GameDetailsActionTypes.RequestGameDetailsComplete: {
      const serverGameData = action.payload;
      const levels = path(['stat', 'Levels'], serverGameData);
      const dataByTeam = path(['stat', 'DataByTeam'], serverGameData);
      const dataByLevels = path(['stat', 'DataByLevelsRow'], serverGameData);
      const finishResults = sortFinishResults(serverGameData.stat.FinishResults);

      const selectedTotalTab = pipe(
        getPossibleLevelTypes,
        head
      )(levels);
      return merge(gameDetailsState,
        { levels, dataByTeam, dataByLevels, finishResults, isLoading: false, selectedTotalTab, originalData: serverGameData }
      );
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
    prop('levels'),
    getPossibleLevelTypes
  )(state) as number[]
);
export const getFinishResults = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('finishResults', state) as QuestStat.TeamData[]
);
export const getLevels = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('levels', state) as QuestStat.LevelData[]
);
export const getLoadingState = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  prop('isLoading', state)
);
export const getSortedTeamsTotalResulst = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) => {
  const selectedType = prop('selectedTotalTab', state);
  const matchedLevels = getMatchedLevels(selectedType, state);
  const calculatedStat = (team) => getCalculatedStat(matchedLevels, team);

  return pipe(
    prop('dataByTeam'),
    map(calculatedStat),
    sortWith([
      descend(prop('closedLevels')),
      ascend(prop('duration'))
    ])
  )(state);
});
export const getStatData = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) => {
  const levels = pipe(
    prop('dataByLevels'),
    curry(appendFinishStat)(state.finishResults)
  )(state) as QuestStat.TeamData[][];
  const teams = pipe(
    prop('dataByTeam'),
    curry(sortTeamList)(state.finishResults) as any,
    curry(appendFinishStatToTeam)(state.finishResults) as any,
    map(prop('data'))
  )(state) as QuestStat.TeamData[][];
  console.log('here');

  return {
    levels,
    teams
  };
});
export const hasPendingChanges = createSelector(selectGameDetailsStore, (state: QuestStat.Store.GameDetails) =>
  !equals(
    map(prop('type'))(state.levels),
    map(prop('type'))(state.originalData.stat.Levels)
  )
);
