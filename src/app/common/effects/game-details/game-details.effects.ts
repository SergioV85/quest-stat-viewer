import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import {
  GameDetailsActionTypes,
  RequestGameDetailsAction,
  RequestGameDetailsFailedAction,
  RequestGameDetailsSuccessAction,
  GetLatestDataFromEnAction,
  SaveLevelsTypesSuccessAction,
  SaveLevelsTypesFailedAction,
  SaveLevelsTypesAction,
} from '@app-common/actions/game-details.actions';
import { ErrorNotificationAction, SuccessNotificationAction } from '@app-common/actions/notification.actions';
import { getGameId, getGameDomain, getLevels } from '@app-common/reducers/game-details/game-details.reducer';

@Injectable()
export class GameDetailsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<QuestStat.Store.State>,
    private readonly apiService: ApiService,
  ) {}

  @Effect()
  public getGames$ = this.actions$.pipe(
    ofType(GameDetailsActionTypes.RequestGameDetails),
    map((action: RequestGameDetailsAction) => action.payload),
    exhaustMap(({ domain, id, force }) =>
      this.apiService.getGameStat({ domain, id, force }).pipe(
        map(gameData => new RequestGameDetailsSuccessAction(gameData)),
        catchError(err => {
          const actions = [
            new RequestGameDetailsFailedAction(err.error),
            new ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ];
          return from(actions);
        }),
      ),
    ),
  );

  @Effect()
  public getGameDataFromEn$ = this.actions$.pipe(
    ofType(GameDetailsActionTypes.GetLatestDataFromEn),
    withLatestFrom(this.store$),
    map(([action, state]: [GetLatestDataFromEnAction, QuestStat.Store.State]) => ({
      id: getGameId(state),
      domain: getGameDomain(state),
    })),
    map(({ domain, id }) => new RequestGameDetailsAction({ domain, id, force: true })),
  );

  @Effect()
  public saveLevels$ = this.actions$.pipe(
    ofType(GameDetailsActionTypes.SaveLevelsTypes),
    withLatestFrom(this.store$),
    map(([action, state]: [SaveLevelsTypesAction, QuestStat.Store.State]) => ({
      gameId: getGameId(state),
      levelData: getLevels(state),
    })),
    exhaustMap(({ levelData, gameId }) =>
      this.apiService.saveLevelSettings({ gameId, levelData }).pipe(
        mergeMap(gameData => [
          new SaveLevelsTypesSuccessAction(),
          new SuccessNotificationAction({ message: 'Данные сохраненны' }),
        ]),
        catchError(err => {
          const actions = [
            new SaveLevelsTypesFailedAction(err.error),
            new ErrorNotificationAction({ message: 'Извините, не удалось сохранить данные' }),
          ];
          return from(actions);
        }),
      ),
    ),
  );
}
