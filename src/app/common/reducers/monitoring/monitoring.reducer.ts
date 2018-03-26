import { Action } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { map, merge, pipe, prop, toPairs } from 'ramda';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';

export const initialState: QuestStat.Store.Monitoring = {
  dataLoaded: false
};

export function monitoringReducer(monitoringState = initialState, action: MonitoringActions.MonitoringActions): QuestStat.Store.Monitoring {
  switch (action.type) {
    case MonitoringActions.MonitoringActionTypes.RequestMonitoring: {
      return merge(monitoringState, { isLoading: true });
    }
    case MonitoringActions.MonitoringActionTypes.RequestMonitoringComplete: {
      const monitoringData = action.payload;
      const totalStat = pipe(
        prop('totalStat'),
        toPairs,
        map((pair) => ({ name: pair[0], data: pair[1] }))
      )(action.payload);
      const byTeams = pipe(
        prop('byTeams')
      )(action.payload);
      return merge(monitoringState, { isLoading: false, dataLoaded: true, totalStat, byTeams });
    }
    case MonitoringActions.MonitoringActionTypes.RequestMonitoringError: {
      return merge(monitoringState, { isLoading: false });
    }
    default:
      return monitoringState;
  }
}

/* Selectors */
export const selectMonitoringStore = (state: QuestStat.Store.State) => state.monitoring;
export const getMonitoringByTeam = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('byTeams', state)
);
export const getTotalStat = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('totalStat', state)
);
export const getLoadingState = createSelector(selectMonitoringStore, (state: QuestStat.Store.Monitoring) =>
  prop('isLoading', state)
);
