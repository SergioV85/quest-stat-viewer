import { Action } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { flip, ifElse, map, merge, of, pick, pipe, prop, propEq, propOr, subtract, toPairs } from 'ramda';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';

export const initialState: QuestStat.Store.Monitoring = {
  dataLoaded: false
};

export function monitoringReducer(monitoringState = initialState, action: MonitoringActions.MonitoringActions): QuestStat.Store.Monitoring {
  switch (action.type) {
    case MonitoringActions.MonitoringActionTypes.RequestMonitoring:
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
      const data = {
        [action.payload.teamId]: action.payload.monitoringData
      };
      const teamData = merge(monitoringState.teamData, data);
      return merge(monitoringState, { isLoading: true, teamData });
    }
    case MonitoringActions.MonitoringActionTypes.GetMonitoringDetailsError:
    case MonitoringActions.MonitoringActionTypes.RequestMonitoringError: {
      return merge(monitoringState, { isLoading: false });
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
export const getLoadingState = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('isLoading', state)
);
