import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import {
  RequestMonitoringAction,
  MonitoringActionTypes,
  RequestMonitoringSuccessAction,
  RequestMonitoringFailedAction,
  GetMonitoringDetailsAction,
  GetMonitoringDetailsSuccessAction,
  GetMonitoringDetailsFailedAction,
  RequestCodesSuccessAction,
  RequestCodesAction,
  RequestCodesFailedAction,
} from '@app-common/actions/monitoring.actions';
import { ErrorNotificationAction } from '@app-common/actions/notification.actions';
import { getGameId } from '@app-common/reducers/game-details/game-details.reducer';

@Injectable()
export class MonitoringEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<QuestStat.Store.State>,
    private readonly apiService: ApiService,
  ) {}

  @Effect()
  public getMonitoring$ = this.actions$.pipe(
    ofType(MonitoringActionTypes.RequestMonitoring),
    map((action: RequestMonitoringAction) => action.payload),
    exhaustMap(({ domain, id }) =>
      this.apiService.getMonitoringData({ domain, id }).pipe(
        map(monitoringData => new RequestMonitoringSuccessAction(monitoringData)),
        catchError(err => {
          const actions = [
            new RequestMonitoringFailedAction(err.error),
            new ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ];
          return from(actions);
        }),
      ),
    ),
  );

  @Effect()
  public getMonitoringDetails$ = this.actions$.pipe(
    ofType(MonitoringActionTypes.GetMonitoringDetails),
    withLatestFrom(this.store$),
    map(([action, state]: [GetMonitoringDetailsAction, QuestStat.Store.State]) => ({
      gameId: getGameId(state),
      ...action.payload,
    })),
    exhaustMap(({ gameId, playerId, teamId, detailsLevel }) =>
      this.apiService.getMonitoringDetails({ gameId, playerId, teamId, detailsLevel }).pipe(
        map(
          monitoringData =>
            new GetMonitoringDetailsSuccessAction({
              detailsLevel,
              playerId,
              teamId,
              monitoringData,
            }),
        ),
        catchError(err => {
          const actions = [
            new GetMonitoringDetailsFailedAction(err.error),
            new ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ];
          return from(actions);
        }),
      ),
    ),
  );

  @Effect()
  public $getCodesList = this.actions$.pipe(
    ofType(MonitoringActionTypes.RequestCodes),
    withLatestFrom(this.store$),
    map(([action, state]: [RequestCodesAction, QuestStat.Store.State]) => ({
      gameId: getGameId(state),
      ...action.payload,
    })),
    exhaustMap(({ gameId, playerId, teamId, levelId, type }) =>
      this.apiService.getListOfCodes({ gameId, playerId, teamId, levelId, type }).pipe(
        map(codes => new RequestCodesSuccessAction({ playerId, teamId, levelId, codes, type })),
        catchError(err => {
          const actions = [
            new RequestCodesFailedAction(err.error),
            new ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ];
          return from(actions);
        }),
      ),
    ),
  );
}
