import { createSelector, createReducer, on, Action } from '@ngrx/store';
import {
  ascend,
  clone,
  descend,
  equals,
  find,
  head,
  map,
  mergeRight,
  path,
  pipe,
  pluck,
  prop,
  propEq,
  sortWith,
} from 'ramda';

import { GameDetailsState, LevelData, TeamData, GroupedTeamData, State, UnaryOperator } from '@app-common/models';
import {
  ChangeLevelTypeAction,
  ChangeTotalStatTabAction,
  CleanGameDataAction,
  GetLatestDataFromEnAction,
  RemoveLevelFromStatAction,
  RequestGameDetailsAction,
  RequestGameDetailsFailedAction,
  RequestGameDetailsSuccessAction,
  SaveLevelsTypesAction,
  SaveLevelsTypesFailedAction,
  SaveLevelsTypesSuccessAction,
} from '@app-core/game-details/actions/game-details.actions';
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

export const initialState: GameDetailsState = {
  isLoading: false,
};

const reducer = createReducer(
  initialState,
  on(ChangeLevelTypeAction, (state, { level, levelType }) => {
    const currentLevels = prop('levels', state);
    if (!currentLevels) {
      return state;
    }
    const levels = updateLevels({ level, type: levelType }, currentLevels);

    return mergeRight(state, { levels });
  }),
  on(ChangeTotalStatTabAction, (state, { tab }) => mergeRight(state, { selectedTotalTab: tab })),
  on(CleanGameDataAction, _ => initialState),
  on(GetLatestDataFromEnAction, state =>
    mergeRight(state, { originalLevels: [], levels: [], dataByTeam: [], dataByLevels: [], finishResults: [] }),
  ),
  on(RemoveLevelFromStatAction, (state, { removed, level }) => {
    const currentLevels = prop('levels', state);
    const currentStatByLevels = prop('dataByLevels', state);
    const currentStatByTeams = prop('dataByTeam', state);
    const currentFinishResults = prop('finishResults', state);

    if (!currentLevels || !currentStatByLevels || !currentStatByTeams || !currentFinishResults) {
      return state;
    }

    const levels = updateLevels({ removed, level }, currentLevels);

    const newLevel = find(propEq('level', level) as UnaryOperator<LevelData, boolean>, levels) as LevelData;

    const dataByLevels = updateStatByLevel(newLevel, currentStatByLevels);
    const dataByTeam = updateStatByTeams(newLevel, currentStatByTeams);
    const finishResults = updateFinishStat(newLevel, dataByTeam, currentFinishResults);

    return mergeRight(state, { levels, dataByLevels, dataByTeam, finishResults });
  }),
  on(RequestGameDetailsAction, SaveLevelsTypesAction, state => mergeRight(state, { isLoading: true })),
  on(RequestGameDetailsFailedAction, SaveLevelsTypesFailedAction, state => mergeRight(state, { isLoading: false })),
  on(RequestGameDetailsSuccessAction, (state, { data }) => {
    if (!data) {
      return state;
    }

    const gameInfo = prop('info', data);
    const levels = path(['stat', 'Levels'], data) as LevelData[];
    const dataByTeam = path(['stat', 'DataByTeam'], data) as GroupedTeamData[];
    const dataByLevels = path(['stat', 'DataByLevels'], data) as TeamData[][];

    const finishResults = sortFinishResults(data.stat.FinishResults);

    const selectedTotalTab: number = pipe(
      getPossibleLevelTypes as UnaryOperator<LevelData[], number[]>,
      head as UnaryOperator<number[], number>,
    )(levels);
    return mergeRight(state, {
      gameInfo,
      levels,
      dataByTeam,
      dataByLevels,
      finishResults,
      isLoading: false,
      selectedTotalTab,
      originalLevels: levels,
    });
  }),
  on(SaveLevelsTypesSuccessAction, state => {
    const originalLevels = clone(state.levels);
    return mergeRight(state, { isLoading: false, originalLevels });
  }),
);

export function gameDetailsReducer(gameDetailsState = initialState, action: Action) {
  return reducer(gameDetailsState, action);
}

/* Selectors */

export const selectGameDetailsStore = (state: State) => state.gameDetails as GameDetailsState;
export const getActiveTabOnTotalStatState = createSelector(selectGameDetailsStore, (state: GameDetailsState) =>
  prop('selectedTotalTab', state),
);
export const getGameId = createSelector(
  selectGameDetailsStore,
  (state: GameDetailsState) => path(['gameInfo', 'GameId'], state) as number,
);
export const getGameDomain = createSelector(
  selectGameDetailsStore,
  (state: GameDetailsState) => path(['gameInfo', 'Domain'], state) as string,
);
export const getFinishResults = createSelector(
  selectGameDetailsStore,
  prop('finishResults') as (data: GameDetailsState) => TeamData[] | null,
);
export const getLevels = createSelector(
  selectGameDetailsStore,
  prop('levels') as (data: GameDetailsState) => LevelData[],
);
export const getAvailableLevelTypes = createSelector(getLevels, getPossibleLevelTypes);
export const getLoadingState = createSelector(selectGameDetailsStore, prop('isLoading'));
export const getSortedTeamsTotalResults = createSelector(selectGameDetailsStore, (state: GameDetailsState) => {
  const selectedType = prop('selectedTotalTab', state) as number;
  const matchedLevels = getMatchedLevels(selectedType, state);
  const calculatedStat = (team: GroupedTeamData) => getCalculatedStat(matchedLevels, team);

  return pipe(
    prop('dataByTeam') as UnaryOperator<GameDetailsState, GroupedTeamData[]>,
    map(calculatedStat),
    sortWith([descend(prop('closedLevels')), ascend(prop('duration'))]),
  )(state);
});
export const getStatData = createSelector(selectGameDetailsStore, (state: GameDetailsState) => {
  const finishResults = state.finishResults as TeamData[];
  const levels = pipe(prop('dataByLevels') as UnaryOperator<GameDetailsState, TeamData[][]>, (data: TeamData[][]) =>
    appendFinishStat(finishResults, data),
  )(state);
  const teams = pipe(
    prop('dataByTeam') as UnaryOperator<GameDetailsState, GroupedTeamData[]>,
    (data: GroupedTeamData[]): GroupedTeamData[] => sortTeamList(finishResults, data),
    (data: GroupedTeamData[]): GroupedTeamData[] => appendFinishStatToTeam(finishResults, data),
    pluck('data'),
  )(state);

  return {
    levels,
    teams,
  };
});
export const hasPendingChanges = createSelector(
  selectGameDetailsStore,
  (state: GameDetailsState) =>
    !equals(pluck('type', state.levels as LevelData[]), pluck('type', state.originalLevels as LevelData[])),
);
