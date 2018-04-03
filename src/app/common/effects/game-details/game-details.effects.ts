import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs/observable/from';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import * as GameDetailsActions from '@app-common/actions/game-details.actions';
import * as NotificationActions from '@app-common/actions/notification.actions';
import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';

@Injectable()
export class GameDetailsEffects {

  constructor(private actions$: Actions,
              private store$: Store<QuestStat.Store.State>,
              private apiService: ApiService) {}

  @Effect()
  public $getGames = this.actions$.pipe(
    ofType(GameDetailsActions.GameDetailsActionTypes.RequestGameDetails),
    map((action: GameDetailsActions.RequestGameDetailsAction) => action.payload),
    exhaustMap(({ domain, id, force }) =>
      this.apiService.getGameStat({ domain, id, force })
        .pipe(
          map((gameData) => new GameDetailsActions.RequestGameDetailsSuccessAction(gameData)),
          catchError((err) => {
            const actions = [
              new GameDetailsActions.RequestGameDetailsFailedAction(err.error),
              new NotificationActions.ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' })
            ];
            return from(actions);
          })
        )
    )
  );

  @Effect()
  public $getGameDataFromEn = this.actions$.pipe(
    ofType(GameDetailsActions.GameDetailsActionTypes.GetLatestDataFromEn),
    withLatestFrom(this.store$),
    map(([action, state]: ([GameDetailsActions.GetLatestDataFromEnAction, QuestStat.Store.State])) => ({
      id: GameDetailsReducer.getGameId(state),
      domain: GameDetailsReducer.getGameDomain(state)
    })),
    map(({ domain, id }) => new GameDetailsActions.RequestGameDetailsAction({ domain, id, force: true }))
  );

  @Effect()
  public $saveLevels = this.actions$.pipe(
    ofType(GameDetailsActions.GameDetailsActionTypes.SaveLevelsTypes),
    withLatestFrom(this.store$),
    map(([action, state]: ([GameDetailsActions.SaveLevelsTypesAction, QuestStat.Store.State])) => ({
      gameId: GameDetailsReducer.getGameId(state),
      levelData: GameDetailsReducer.getLevels(state)
    })),
    exhaustMap(({ levelData, gameId }) =>
      this.apiService.saveLevelSettings({ gameId, levelData })
        .pipe(
          mergeMap((gameData) => [
            new GameDetailsActions.SaveLevelsTypesSuccessAction(),
            new NotificationActions.SuccessNotificationAction({ message: 'Данные сохраненны' })
          ]),
          catchError((err) => {
            const actions = [
              new GameDetailsActions.SaveLevelsTypesFailedAction(err.error),
              new NotificationActions.ErrorNotificationAction({ message: 'Извините, не удалось сохранить данные' })
            ];
            return from(actions);
          })
        )
    )
  );
}
