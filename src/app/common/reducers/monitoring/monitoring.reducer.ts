import { Action } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { flip, ifElse, isNil, map, merge, mergeDeepRight, of, pick, pipe, prop, propEq, propOr, subtract, toPairs } from 'ramda';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';

export const initialState: QuestStat.Store.Monitoring = {
  dataLoaded: false
};

export function monitoringReducer(monitoringState = initialState, action: MonitoringActions.MonitoringActions): QuestStat.Store.Monitoring {
  switch (action.type) {
    case MonitoringActions.MonitoringActionTypes.RequestMonitoring:
    case MonitoringActions.MonitoringActionTypes.RequestCodes:
    case MonitoringActions.MonitoringActionTypes.GetMonitoringDetails: {
      return merge(monitoringState, { isLoading: true });
    }
    case MonitoringActions.MonitoringActionTypes.RequestMonitoringComplete: {
      const monitoringData = action.payload;
      const pagesLeft = subtract(
        propOr(0, 'totalPages', monitoringData) as number,
        propOr(0, 'pageSaved', monitoringData) as number
      );
      const parsingStat = pipe(
        pick(['pageSaved', 'parsed', 'totalPages']),
        flip(merge)({ pagesLeft })
      )(monitoringData);

      const totalData = propOr(null, 'totalData', action.payload);

      return merge(monitoringState, { isLoading: false, dataLoaded: true, ...parsingStat, totalData });
    }
    case MonitoringActions.MonitoringActionTypes.GetMonitoringDetailsComplete: {
      const groupType = action.payload.detailsLevel;
      let monitoringData;
      switch (groupType) {
        case 'byPlayer':
          monitoringData = { playerData: merge(monitoringState.playerData, {
              [action.payload.playerId]: action.payload.monitoringData
            })
          };
          break;
        case 'byTeam':
        default:
          monitoringData = { teamData: merge(monitoringState.teamData, {
              [action.payload.teamId]: action.payload.monitoringData
            })
          };
      }
      return merge(monitoringState, { isLoading: true, ...monitoringData });
    }
    case MonitoringActions.MonitoringActionTypes.RequestCodesComplete: {

      const type = action.payload.type;
      const propertyName = type === 'byLevel' ? action.payload.teamId : action.payload.playerId;
      const codes = mergeDeepRight(monitoringState.codes, {
        [propertyName]: {
          [action.payload.levelId]: action.payload.codes
        }
      });
      return merge(monitoringState, { isLoading: false, codes });
    }
    case MonitoringActions.MonitoringActionTypes.GetMonitoringDetailsError:
    case MonitoringActions.MonitoringActionTypes.RequestCodesError:
    case MonitoringActions.MonitoringActionTypes.RequestMonitoringError: {
      return merge(monitoringState, { isLoading: false });
    }
    case MonitoringActions.MonitoringActionTypes.CleanMonitoringData: {
      return initialState;
    }
    default:
      return monitoringState;
  }
}

/* Selectors */
export const selectMonitoringStore = (state: QuestStat.Store.State) => state.monitoring;
export const dataParsed = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('parsed', state)
);
export const getParsingStat = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  pick(['pagesLeft', 'pageSaved', 'totalPages'], state)
);
export const getTotalData = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('totalData', state)
);
export const getTeamData = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('teamData', state)
);
export const getPlayerData = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('playerData', state)
);
export const getCodesByTeam = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('codes', state)
);
export const getCodesByPlayer = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('codes', state)
);
export const getLoadingState = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('isLoading', state)
);
