import { createSelector, createReducer, on, Action } from '@ngrx/store';
import {
  ascend,
  clone,
  curry,
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
} from '@app-common/actions/game-details.actions';
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

    const newLevel = find(propEq('level', level), levels) as QuestStat.LevelData;

    const dataByLevels = updateStatByLevel(newLevel, currentStatByLevels);
    const dataByTeam = updateStatByTeams(newLevel, currentStatByTeams);
    const finishResults = updateFinishStat(newLevel, dataByTeam, currentFinishResults);

    return mergeRight(state, { levels, dataByLevels, dataByTeam, finishResults });
  }),
  on(RequestGameDetailsAction, SaveLevelsTypesAction, state => mergeRight(state, { isLoading: true })),
  on(RequestGameDetailsFailedAction, SaveLevelsTypesFailedAction, state => mergeRight(state, { isLoading: false })),
  on(RequestGameDetailsSuccessAction, (state, { data }) => {
    const levels: QuestStat.LevelData[] | undefined = path(['stat', 'Levels'], state);
    const dataByTeam: QuestStat.GroupedTeamData[] | undefined = path(['stat', 'DataByTeam'], state);
    const dataByLevels: QuestStat.TeamData[] | undefined = path(['stat', 'DataByLevels'], state);

    if (!levels || !dataByLevels || !dataByTeam || !data) {
      return state;
    }

    const gameInfo = prop('info', data);
    const finishResults = sortFinishResults(data.stat.FinishResults);

    const selectedTotalTab = pipe(
      getPossibleLevelTypes as (data: QuestStat.LevelData[]) => number[],
      head,
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
export const getFinishResults = createSelector(
  selectGameDetailsStore,
  prop('finishResults') as (data: QuestStat.Store.GameDetails) => QuestStat.TeamData[],
);
export const getLevels = createSelector(
  selectGameDetailsStore,
  prop('levels') as (data: QuestStat.Store.GameDetails) => QuestStat.LevelData[],
);
export const getAvailableLevelTypes = createSelector(
  getLevels,
  getPossibleLevelTypes,
);
export const getLoadingState = createSelector(
  selectGameDetailsStore,
  prop('isLoading') as (data: QuestStat.Store.GameDetails) => boolean,
);
export const getSortedTeamsTotalResults = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => {
    const selectedType = prop('selectedTotalTab', state) as number;
    const matchedLevels = getMatchedLevels(selectedType, state);
    const calculatedStat = (team: QuestStat.GroupedTeamData) => getCalculatedStat(matchedLevels, team);

    return pipe(
      prop('dataByTeam') as (data: QuestStat.Store.GameDetails) => QuestStat.GroupedTeamData[],
      map(calculatedStat),
      sortWith([descend(prop('closedLevels')), ascend(prop('duration'))]),
    )(state);
  },
);
export const getStatData = createSelector(
  selectGameDetailsStore,
  (state: QuestStat.Store.GameDetails) => {
    const finishResults = state.finishResults as QuestStat.TeamData[];
    const levels = pipe(
      prop('dataByLevels') as (data: QuestStat.Store.GameDetails) => QuestStat.TeamData[][],
      curry(appendFinishStat)(finishResults),
    )(state);
    const teams = pipe(
      prop('dataByTeam') as (data: QuestStat.Store.GameDetails) => QuestStat.GroupedTeamData[],
      curry(sortTeamList)(finishResults),
      curry(appendFinishStatToTeam)(finishResults),
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
  (state: QuestStat.Store.GameDetails) =>
    !equals(
      pluck('type', state.levels as QuestStat.LevelData[]),
      pluck('type', state.originalLevels as QuestStat.LevelData[]),
    ),
);
