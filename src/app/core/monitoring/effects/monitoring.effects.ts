import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

import { State } from '@app-common/models';
import { ApiService } from '@app-common/services/api/api.service';
import { ErrorNotificationAction } from '@app-common/actions/notification.actions';
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
} from '@app-core/monitoring/actions/monitoring.actions';
import { getGameId } from '@app-core/game-details/reducers/game-details.reducer';

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
    map(([request, state]) => ({
      gameId: getGameId(state),
      ...request,
    })),
    exhaustMap((request: { gameId: number; playerId?: number; teamId?: number; detailsLevel: string }) =>
      this.apiService.getMonitoringDetails(request).pipe(
        map(monitoringData =>
          GetMonitoringDetailsSuccessAction({
            ...request,
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
    exhaustMap(
      (request: { gameId: number; playerId?: number; teamId?: number; levelId: number; requestType: string }) =>
        this.apiService.getListOfCodes(request).pipe(
          map(codes => RequestCodesSuccessAction({ ...request, codes })),
          catchError(err =>
            from([RequestCodesFailedAction(err.error), ErrorNotificationAction({ message: DEFAULT_ERROR_MESSAGE })]),
          ),
        ),
    ),
  );
}
