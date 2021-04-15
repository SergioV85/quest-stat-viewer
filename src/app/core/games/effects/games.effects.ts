import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { ApiService } from '@app-common/services/api/api.service';
import { GAMES_LIST_ACTIONS } from '@app-core/games/actions/games.actions';

@Injectable()
export class GamesEffects {
  public getGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GAMES_LIST_ACTIONS.requestGames),
      exhaustMap(() =>
        this.apiService.getSavedGames().pipe(
          map((data) => GAMES_LIST_ACTIONS.requestGamesSuccess({ data })),
          catchError((err) =>
            from([
              GAMES_LIST_ACTIONS.requestGamesFailed(err.error),
              NOTIFICATION_ACTIONS.errorNotification({ message: 'Извините, не удалось загрузить данные' }),
            ]),
          ),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly apiService: ApiService) {}
}
