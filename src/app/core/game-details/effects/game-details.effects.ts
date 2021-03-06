import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { State } from '@app-common/models';
import { ErrorNotificationAction, SuccessNotificationAction } from '@app-common/actions/notification.actions';
import { ApiService } from '@app-common/services/api/api.service';
import {
  GetLatestDataFromEnAction,
  RequestGameDetailsAction,
  RequestGameDetailsFailedAction,
  RequestGameDetailsSuccessAction,
  SaveLevelsTypesAction,
  SaveLevelsTypesFailedAction,
  SaveLevelsTypesSuccessAction,
} from '@app-core/game-details/actions/game-details.actions';

import { getGameId, getGameDomain, getLevels } from '@app-core/game-details/reducers/game-details.reducer';

@Injectable()
export class GameDetailsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<State>,
    private readonly apiService: ApiService,
  ) {}

  @Effect()
  public getGameDetails$ = this.actions$.pipe(
    ofType(RequestGameDetailsAction),
    exhaustMap(({ domain, id }) =>
      this.apiService.getGameStat({ domain, id }).pipe(
        map(data => RequestGameDetailsSuccessAction({ data })),
        catchError(err =>
          from([
            RequestGameDetailsFailedAction(err.error),
            ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ]),
        ),
      ),
    ),
  );

  @Effect()
  public getGameDataFromEn$ = this.actions$.pipe(
    ofType(GetLatestDataFromEnAction),
    withLatestFrom(this.store$),
    map(([action, state]) => ({
      id: getGameId(state),
      domain: getGameDomain(state),
    })),
    map(({ domain, id }) => RequestGameDetailsAction({ domain, id, force: true })),
  );

  @Effect()
  public saveLevels$ = this.actions$.pipe(
    ofType(SaveLevelsTypesAction),
    withLatestFrom(this.store$),
    map(([action, state]) => ({
      gameId: getGameId(state),
      levelData: getLevels(state),
    })),
    exhaustMap(({ levelData, gameId }) =>
      this.apiService.saveLevelSettings({ gameId, levelData }).pipe(
        mergeMap(gameData => [
          SaveLevelsTypesSuccessAction(),
          SuccessNotificationAction({ message: 'Данные сохраненны' }),
        ]),
        catchError(err =>
          from([
            SaveLevelsTypesFailedAction(err.error),
            ErrorNotificationAction({ message: 'Извините, не удалось сохранить данные' }),
          ]),
        ),
      ),
    ),
  );
}
