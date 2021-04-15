import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, withLatestFrom } from 'rxjs/operators';

import { State } from '@app-common/models';
import { ApiService } from '@app-common/services/api/api.service';
import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { MONITORING_ACTIONS } from '@app-core/monitoring/actions/monitoring.actions';
import { getGameId } from '@app-core/game-details/reducers/game-details.reducer';

const DEFAULT_ERROR_MESSAGE = 'Извините, не удалось загрузить данные';

@Injectable()
export class MonitoringEffects {
  public getMonitoring$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MONITORING_ACTIONS.requestMonitoring),
      exhaustMap(({ domain, id }) =>
        this.apiService.getMonitoringData({ domain, id }).pipe(
          map((data) => MONITORING_ACTIONS.requestMonitoringSuccess({ data })),
          catchError((err) =>
            from([
              MONITORING_ACTIONS.requestMonitoringFailed(err.error),
              NOTIFICATION_ACTIONS.errorNotification({ message: DEFAULT_ERROR_MESSAGE }),
            ]),
          ),
        ),
      ),
    ),
  );

  public getMonitoringDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MONITORING_ACTIONS.getMonitoringDetails),
      withLatestFrom(this.store$),
      map(([request, state]) => ({
        gameId: getGameId(state),
        ...request,
      })),
      exhaustMap((request: { gameId: number; playerId?: number; teamId?: number; detailsLevel: string }) =>
        this.apiService.getMonitoringDetails(request).pipe(
          map((monitoringData) =>
            MONITORING_ACTIONS.getMonitoringDetailsSuccess({
              ...request,
              monitoringData,
            }),
          ),
          catchError((err) =>
            from([
              MONITORING_ACTIONS.getMonitoringDetailsFailed(err.error),
              NOTIFICATION_ACTIONS.errorNotification({ message: DEFAULT_ERROR_MESSAGE }),
            ]),
          ),
        ),
      ),
    ),
  );

  public getCodesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MONITORING_ACTIONS.requestCodes),
      withLatestFrom(this.store$),
      map(([{ query }, state]) => ({
        gameId: getGameId(state),
        ...query,
      })),
      exhaustMap(
        (request: { gameId: number; playerId?: number; teamId?: number; levelId: number; requestType: string }) =>
          this.apiService.getListOfCodes(request).pipe(
            map((codes) => MONITORING_ACTIONS.requestCodesSuccess({ ...request, codes })),
            catchError((err) =>
              from([
                MONITORING_ACTIONS.requestCodesFailed(err.error),
                NOTIFICATION_ACTIONS.errorNotification({ message: DEFAULT_ERROR_MESSAGE }),
              ]),
            ),
          ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<State>,
    private readonly apiService: ApiService,
  ) {}
}
