import { createSelector } from '@ngrx/store';
import { flip, merge, mergeDeepRight, pick, pipe, prop, propOr, subtract } from 'ramda';
import { MonitoringActions, MonitoringActionTypes } from '@app-common/actions/monitoring.actions';

export const initialState: QuestStat.Store.Monitoring = {
  dataLoaded: false,
};

export function monitoringReducer(
  monitoringState = initialState,
  action: MonitoringActions,
): QuestStat.Store.Monitoring {
  switch (action.type) {
    case MonitoringActionTypes.RequestMonitoring:
    case MonitoringActionTypes.RequestCodes:
    case MonitoringActionTypes.GetMonitoringDetails: {
      return merge(monitoringState, { isLoading: true });
    }
    case MonitoringActionTypes.RequestMonitoringComplete: {
      const monitoringData = action.payload;
      const pagesLeft = subtract(
        propOr(0, 'totalPages', monitoringData) as number,
        propOr(0, 'pageSaved', monitoringData) as number,
      );
      const parsingStat = pipe(
        pick(['pageSaved', 'parsed', 'totalPages']),
        flip(merge)({ pagesLeft }),
      )(monitoringData);

      // tslint:disable-next-line: no-any
      const totalData = propOr(null, 'totalData', action.payload) as any;

      return merge(monitoringState, { isLoading: false, dataLoaded: true, ...parsingStat, totalData });
    }
    case MonitoringActionTypes.GetMonitoringDetailsComplete: {
      const groupType = action.payload.detailsLevel;
      let monitoringData;
      switch (groupType) {
        case 'byPlayer':
          monitoringData = {
            playerData: merge(monitoringState.playerData, {
              [action.payload.playerId]: action.payload.monitoringData,
            }),
          };
          break;
        case 'byTeam':
        default:
          monitoringData = {
            teamData: merge(monitoringState.teamData, {
              [action.payload.teamId]: action.payload.monitoringData,
            }),
          };
      }
      return merge(monitoringState, { isLoading: true, ...monitoringData }) as QuestStat.Store.Monitoring;
    }
    case MonitoringActionTypes.RequestCodesComplete: {
      const type = action.payload.type;
      const propertyName = type === 'byLevel' ? action.payload.teamId : action.payload.playerId;
      const codes = mergeDeepRight(monitoringState.codes, {
        [propertyName]: {
          [action.payload.levelId]: action.payload.codes,
        },
      });
      return merge(monitoringState, { isLoading: false, codes });
    }
    case MonitoringActionTypes.GetMonitoringDetailsError:
    case MonitoringActionTypes.RequestCodesError:
    case MonitoringActionTypes.RequestMonitoringError: {
      return merge(monitoringState, { isLoading: false });
    }
    case MonitoringActionTypes.CleanMonitoringData: {
      return initialState;
    }
    default:
      return monitoringState;
  }
}

/* Selectors */
export const selectMonitoringStore = (state: QuestStat.Store.State) => state.monitoring;
export const dataParsed = createSelector(
  selectMonitoringStore,
  prop('parsed'),
);
export const getParsingStat = createSelector(
  selectMonitoringStore,
  (state: QuestStat.Store.Monitoring) => pick(['pagesLeft', 'pageSaved', 'totalPages'], state),
);
export const getTotalData = createSelector(
  selectMonitoringStore,
  prop('totalData'),
);
export const getTeamData = createSelector(
  selectMonitoringStore,
  prop('teamData'),
);
export const getPlayerData = createSelector(
  selectMonitoringStore,
  prop('playerData'),
);
export const getCodesByTeam = createSelector(
  selectMonitoringStore,
  prop('codes'),
);
export const getCodesByPlayer = createSelector(
  selectMonitoringStore,
  prop('codes'),
);
export const getLoadingState = createSelector(
  selectMonitoringStore,
  prop('isLoading'),
);
