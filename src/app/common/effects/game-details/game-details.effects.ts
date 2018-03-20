import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs/observable/from';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, exhaustMap, map, finalize } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import * as GameDetailsActions from '@app-common/actions/game-details.actions';
import * as NotificationActions from '@app-common/actions/notification.actions';


@Injectable()
export class GameDetailsEffects {

  constructor(private actions$: Actions,
              private apiService: ApiService) {}

  @Effect()
  public $getGames = this.actions$.pipe(
    ofType(GameDetailsActions.GameDetailsActionTypes.RequestGameDetails),
    map((action: GameDetailsActions.RequestGameDetailsAction) => action.payload),
    exhaustMap(({ domain, id }) =>
    this.apiService.getGameStat({ domain, id })
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
}
