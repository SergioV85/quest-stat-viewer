import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs/observable/from';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { catchError, exhaustMap, map, finalize } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import * as GamesActions from '@app-common/actions/games.actions';
import * as NotificationActions from '@app-common/actions/notification.actions';

@Injectable()
export class GamesEffects {

  constructor(private actions$: Actions,
              private apiService: ApiService) {}

  @Effect()
  public $getGames = this.actions$.pipe(
    ofType(GamesActions.GamesActionTypes.RequestGames),
    exhaustMap(() =>
      this.apiService.getSavedGames()
        .pipe(
          map((games) => new GamesActions.RequestGamesSuccessAction(games)),
          catchError((err) => {
            const actions = [
              new GamesActions.RequestGamesFailedAction(err.error),
              new NotificationActions.ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' })
            ];
            return from(actions);
          })
        )
    )
  );
}
