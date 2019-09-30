import { createSelector, createReducer, on, Action } from '@ngrx/store';
import { mergeDeepLeft, mergeLeft, mergeRight, objOf, pick, pipe, prop, propOr, subtract } from 'ramda';
import {
  CodesListResponse,
  MonitoringResponse,
  MonitoringState,
  MonitoringTeamDetailedData,
  MonitoringTeamGroupedData,
  PlayerLevelData,
  State,
} from '@app-common/models';
import {
  CleanMonitoringDataAction,
  GetMonitoringDetailsAction,
  GetMonitoringDetailsFailedAction,
  GetMonitoringDetailsSuccessAction,
  RequestCodesAction,
  RequestCodesFailedAction,
  RequestCodesSuccessAction,
  RequestMonitoringAction,
  RequestMonitoringFailedAction,
  RequestMonitoringSuccessAction,
} from '@app-core/monitoring/actions/monitoring.actions';

export const initialState: MonitoringState = {
  dataLoaded: false,
};

const reducer = createReducer(
  initialState,
  on(CleanMonitoringDataAction, _ => initialState),
  on(GetMonitoringDetailsAction, RequestCodesAction, RequestMonitoringAction, state =>
    mergeRight(state, { isLoading: true }),
  ),
  on(GetMonitoringDetailsFailedAction, RequestCodesFailedAction, RequestMonitoringFailedAction, state =>
    mergeRight(state, { isLoading: false }),
  ),
  on(GetMonitoringDetailsSuccessAction, (state, { detailsLevel, playerId, teamId, monitoringData }) => {
    const target = detailsLevel === 'byPlayer' ? 'playerData' : 'teamData';
    const key = detailsLevel === 'byPlayer' ? (playerId as number) : (teamId as number);
    return pipe(
      prop(target) as (data: MonitoringState) => (MonitoringState['playerData']) | MonitoringState['teamData'],
      mergeLeft({
        [key]: monitoringData,
      }) as (data: unknown) => { [key: number]: MonitoringResponse },
      objOf(target) as (data: {
        [key: number]: MonitoringResponse;
      }) => { [property in 'playerData' | 'teamData']: { [key: number]: MonitoringResponse } },
      mergeRight({ isLoading: false }) as (
        data: { [property in 'playerData' | 'teamData']: { [key: number]: MonitoringResponse } },
      ) => Partial<MonitoringState>,
      mergeRight(state) as (data: Partial<MonitoringState>) => MonitoringState,
    )(state);
  }),
  on(RequestCodesSuccessAction, (state, { levelId, playerId, teamId, requestType, codes }) => {
    const propertyName = requestType === 'byLevel' ? teamId : playerId;

    return pipe(
      objOf(`${levelId}`),
      objOf(`${propertyName}`),
      mergeDeepLeft(state.codes),
      objOf('codes'),
      mergeRight({ isLoading: false }),
      mergeRight(state),
    )(codes);
  }),
  on(RequestMonitoringSuccessAction, (state, { data }) => {
    const pagesLeft = subtract(propOr(0, 'totalPages', data) as number, propOr(0, 'pageSaved', data) as number);
    const parsingStat = pipe(
      pick(['pageSaved', 'parsed', 'totalPages']),
      mergeLeft({ pagesLeft }),
    )(data);

    // tslint:disable-next-line: no-any
    const totalData = propOr(null, 'totalData', data) as any;

    return mergeRight(state, { isLoading: false, dataLoaded: true, ...parsingStat, totalData });
  }),
);

export function monitoringReducer(monitoringState = initialState, action: Action): MonitoringState {
  return reducer(monitoringState, action);
}

/* Selectors */
export const selectMonitoringStore = (state: State) => state.monitoring as MonitoringState;
export const isDataLoaded = createSelector(
  selectMonitoringStore,
  prop('dataLoaded') as (data: MonitoringState) => boolean,
);
export const isDataParsed = createSelector(
  selectMonitoringStore,
  prop('parsed') as (data: MonitoringState) => boolean,
);
export const getParsingStat = createSelector(
  selectMonitoringStore,
  (state: MonitoringState) => pick(['pagesLeft', 'pageSaved', 'totalPages'], state),
);
export const getTotalData = createSelector(
  selectMonitoringStore,
  prop('totalData') as (data: MonitoringState) => MonitoringTeamGroupedData[],
);
export const getTeamData = createSelector(
  selectMonitoringStore,
  prop('teamData') as (
    data: MonitoringState,
  ) => {
    [key: number]: MonitoringTeamDetailedData;
  },
);
export const getPlayerData = createSelector(
  selectMonitoringStore,
  prop('playerData') as (
    data: MonitoringState,
  ) => {
    [key: number]: {
      parsed: boolean;
      totalData?: PlayerLevelData;
    };
  },
);
export const getCodes = createSelector(
  selectMonitoringStore,
  prop('codes') as (
    data: MonitoringState,
  ) => {
    [key: number]: CodesListResponse;
  },
);
export const getLoadingState = createSelector(
  selectMonitoringStore,
  prop('isLoading') as (data: MonitoringState) => boolean,
);
