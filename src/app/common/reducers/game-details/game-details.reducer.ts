import { createSelector } from '@ngrx/store';
import {
  adjust,
  ascend,
  clone,
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
  uniq,
  pluck,
} from 'ramda';
import { GameDetailsActions, GameDetailsActionTypes } from '@app-common/actions/game-details.actions';
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
  updateStatByTeams,
} from './game-details.helpers';

export const initialState: QuestStat.Store.GameDetails = {
  isLoading: false,
};

export function gameDetailsReducer(gameDetailsState = initialState, action: GameDetailsActions) {
  switch (action.type) {
    case GameDetailsActionTypes.ChangeLevelType: {
      const updatedLevel = action.payload;
      const currentLevels = prop('levels', gameDetailsState) as QuestStat.LevelData[];
      const levels = updateLevels(updatedLevel, currentLevels);

      return merge(gameDetailsState, { levels });
    }
    case GameDetailsActionTypes.ChangeTotalStatTab: {
      const selectedTotalTab = action.payload;
      return merge(gameDetailsState, { selectedTotalTab });
    }
    case GameDetailsActionTypes.CleanGameData: {
      return initialState;
    }
    case GameDetailsActionTypes.GetLatestDataFromEn: {
      const emptyGameData = {
        originalLevels: [],
        levels: [],
        dataByTeam: [],
        dataByLevels: [],
        finishResults: [],
      };
      return merge(gameDetailsState, emptyGameData);
    }
    case GameDetailsActionTypes.RemoveLevelFromStat: {
      const removedLevel = action.payload;

      const currentLevels = prop('levels', gameDetailsState) as QuestStat.LevelData[];
      const currentStatByLevels = prop('dataByLevels', gameDetailsState) as QuestStat.TeamData[][];
      const currentStatByTeams = prop('dataByTeam', gameDetailsState) as QuestStat.GroupedTeamData[];
      const currentFinishResulst = prop('finishResults', gameDetailsState) as QuestStat.TeamData[];

      const levels = updateLevels(removedLevel, currentLevels);

      const newLevel = find(propEq('level', removedLevel.level), levels) as QuestStat.LevelData;

      const dataByLevels = updateStatByLevel(newLevel, currentStatByLevels);
      const dataByTeam = updateStatByTeams(newLevel, currentStatByTeams);
      const finishResults = updateFinishStat(newLevel, dataByTeam, currentFinishResulst);

      return merge(gameDetailsState, { levels, dataByLevels, dataByTeam, finishResults });
    }
    case GameDetailsActionTypes.SaveLevelsTypes: {
      return merge(gameDetailsState, { isLoading: true });
    }
    case GameDetailsActionTypes.RequestGameDetailsComplete: {
      const serverGameData = action.payload;
      const gameInfo = prop('info', serverGameData);
      const levels = path(['stat', 'Levels'], serverGameData) as QuestStat.LevelData[];
      const dataByTeam = path(['stat', 'DataByTeam'], serverGameData) as QuestStat.GroupedTeamData[];
      const dataByLevels = path(['stat', 'DataByLevels'], serverGameData) as QuestStat.TeamData[];
      const finishResults = sortFinishResults(serverGameData.stat.FinishResults);

      const selectedTotalTab = pipe(
        getPossibleLevelTypes as (data: QuestStat.LevelData[]) => number[],
        head,
      )(levels);
      return merge(gameDetailsState, {
        gameInfo,
        levels,
        dataByTeam,
        dataByLevels,
        finishResults,
        isLoading: false,
        selectedTotalTab,
        originalLevels: levels,
      });
    }
    case GameDetailsActionTypes.SaveLevelsTypesComplete: {
      const originalLevels = clone(gameDetailsState.levels);
      return merge(gameDetailsState, { isLoading: false, originalLevels });
    }
    case GameDetailsActionTypes.RequestGameDetailsError:
    case GameDetailsActionTypes.SaveLevelsTypesError: {
      return merge(gameDetailsState, { isLoading: false });
    }
    default:
      return gameDetailsState;
  }
}

/* Selectors */

export const selectGameDetailsStore = (state: QuestStat.Store.State) => state.gameDetails;
export const getActiveTabOnTotalStatState = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => prop('selectedTotalTab', state),
);
export const getGameId = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => path(['gameInfo', 'GameId'], state) as number,
);
export const getGameDomain = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => path(['gameInfo', 'Domain'], state) as string,
);
export const getAvailableLevelTypes = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) =>
    pipe(
      prop('levels'),
      getPossibleLevelTypes,
    )(state),
);
export const getFinishResults = createSelector(
  selectGameDetailsStore,
  prop('finishResults'),
);
export const getLevels = createSelector(
  selectGameDetailsStore,
  prop('levels'),
);
export const getLoadingState = createSelector(
  selectGameDetailsStore,
  prop('isLoading'),
);
export const getSortedTeamsTotalResults = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => {
    const selectedType = prop('selectedTotalTab', state);
    const matchedLevels = getMatchedLevels(selectedType, state);
    const calculatedStat = (team: QuestStat.GroupedTeamData) => getCalculatedStat(matchedLevels, team);

    return pipe(
      prop('dataByTeam'),
      map(calculatedStat),
      sortWith([descend(prop('closedLevels')), ascend(prop('duration'))]),
    )(state);
  },
);
export const getStatData = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => {
    const levels = pipe(
      prop('dataByLevels') as (data: QuestStat.Store.GameDetails) => QuestStat.TeamData[][],
      curry(appendFinishStat)(state.finishResults),
    )(state);
    const teams = pipe(
      prop('dataByTeam') as (data: QuestStat.Store.GameDetails) => QuestStat.GroupedTeamData[],
      curry(sortTeamList)(state.finishResults),
      curry(appendFinishStatToTeam)(state.finishResults),
      pluck('data'),
    )(state);

    return {
      levels,
      teams,
    };
  },
);
export const hasPendingChanges = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => !equals(pluck('type', state.levels), pluck('type', state.originalLevels)),
);
