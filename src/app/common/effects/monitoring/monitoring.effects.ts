import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs/observable/from';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';
import * as NotificationActions from '@app-common/actions/notification.actions';
import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';

@Injectable()
export class MonitoringEffects {

  constructor(private actions$: Actions,
              private store$: Store<QuestStat.Store.State>,
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

  @Effect()
  public $getMonitoringDetails = this.actions$.pipe(
    ofType(MonitoringActions.MonitoringActionTypes.GetMonitoringDetails),
    withLatestFrom(this.store$),
    map(([action, state]: ([MonitoringActions.GetMonitoringDetailsAction, QuestStat.Store.State])) => ({
      gameId: GameDetailsReducer.getGameId(state),
      ...action.payload
    })),
    exhaustMap(({ gameId, playerId, teamId, detailsLevel }) =>
      this.apiService.getMonitoringDetails({ gameId, playerId, teamId, detailsLevel })
        .pipe(
          map((monitoringData) => new MonitoringActions.GetMonitoringDetailsSuccessAction({
            detailsLevel,
            playerId,
            teamId,
            monitoringData
          })),
          catchError((err) => {
            const actions = [
              new MonitoringActions.GetMonitoringDetailsFailedAction(err.error),
              new NotificationActions.ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' })
            ];
            return from(actions);
          })
        )
    )
  );

  @Effect()
  public $getCodesList = this.actions$.pipe(
    ofType(MonitoringActions.MonitoringActionTypes.RequestCodes),
    withLatestFrom(this.store$),
    map(([action, state]: ([MonitoringActions.RequestCodesAction, QuestStat.Store.State])) => ({
      gameId: GameDetailsReducer.getGameId(state),
      ...action.payload
    })),
    exhaustMap(({ gameId, playerId, teamId, levelId, type }) =>
      this.apiService.getListOfCodes({ gameId, playerId, teamId, levelId, type })
        .pipe(
          map((codes) => new MonitoringActions.RequestCodesSuccessAction({ playerId, teamId, levelId, codes, type })),
          catchError((err) => {
            const actions = [
              new MonitoringActions.RequestCodesFailedAction(err.error),
              new NotificationActions.ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' })
            ];
            return from(actions);
          })
        )
    )
  );
}
