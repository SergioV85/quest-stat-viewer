import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

import { State } from '@app-common/models';
import { ApiService } from '@app-common/services/api/api.service';
import {
  RequestMonitoringAction,
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

const DEFAULT_ERROR_MESSAGE = 'Извините, не удалось загрузить данные';

@Injectable()
export class MonitoringEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<State>,
    private readonly apiService: ApiService,
  ) {}

  @Effect()
  public getMonitoring$ = this.actions$.pipe(
    ofType(RequestMonitoringAction),
    exhaustMap(({ domain, id }) =>
      this.apiService.getMonitoringData({ domain, id }).pipe(
        map(data => RequestMonitoringSuccessAction({ data })),
        catchError(err =>
          from([RequestMonitoringFailedAction(err.error), ErrorNotificationAction({ message: DEFAULT_ERROR_MESSAGE })]),
        ),
      ),
    ),
  );

  @Effect()
  public getMonitoringDetails$ = this.actions$.pipe(
    ofType(GetMonitoringDetailsAction),
    withLatestFrom(this.store$),
    map(([{ teamId, playerId, detailsLevel }, state]) => ({
      gameId: getGameId(state),
      teamId,
      playerId,
      detailsLevel,
    })),
    exhaustMap(({ gameId, playerId, teamId, detailsLevel }) =>
      this.apiService.getMonitoringDetails({ gameId, playerId, teamId, detailsLevel }).pipe(
        map(monitoringData =>
          GetMonitoringDetailsSuccessAction({
            detailsLevel,
            playerId,
            teamId,
            monitoringData,
          }),
        ),
        catchError(err =>
          from([
            GetMonitoringDetailsFailedAction(err.error),
            ErrorNotificationAction({ message: DEFAULT_ERROR_MESSAGE }),
          ]),
        ),
      ),
    ),
  );

  @Effect()
  public getCodesList$ = this.actions$.pipe(
    ofType(RequestCodesAction),
    withLatestFrom(this.store$),
    map(([{ query }, state]) => ({
      gameId: getGameId(state),
      ...query,
    })),
    exhaustMap(({ gameId, playerId, teamId, levelId, type }) =>
      this.apiService.getListOfCodes({ gameId, playerId, teamId, levelId, type }).pipe(
        map(codes => RequestCodesSuccessAction({ playerId, teamId, levelId, codes, requestType: type })),
        catchError(err =>
          from([RequestCodesFailedAction(err.error), ErrorNotificationAction({ message: DEFAULT_ERROR_MESSAGE })]),
        ),
      ),
    ),
  );
}
