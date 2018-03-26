import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs/observable/from';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, exhaustMap, map, finalize } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';
import * as NotificationActions from '@app-common/actions/notification.actions';


@Injectable()
export class MonitoringEffects {

  constructor(private actions$: Actions,
              private apiService: ApiService) {}

  @Effect()
  public $getMonitoring = this.actions$.pipe(
    ofType(MonitoringActions.MonitoringActionTypes.RequestMonitoring),
    map((action: MonitoringActions.RequestMonitoringAction) => action.payload),
    exhaustMap(({ domain, id }) =>
      this.apiService.getMonitoringData({ domain, id })
        .pipe(
          map((monitoringData) => new MonitoringActions.RequestMonitoringSuccessAction(monitoringData)),
          catchError((err) => {
            const actions = [
              new MonitoringActions.RequestMonitoringFailedAction(err.error),
              new NotificationActions.ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' })
            ];
            return from(actions);
          })
        )
    )
  );
}
