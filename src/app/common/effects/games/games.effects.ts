import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import {
  GamesActionTypes,
  RequestGamesSuccessAction,
  RequestGamesFailedAction,
} from '@app-common/actions/games.actions';
import { ErrorNotificationAction } from '@app-common/actions/notification.actions';

@Injectable()
export class GamesEffects {
  constructor(private readonly actions$: Actions, private readonly apiService: ApiService) {}

  @Effect()
  public getGames$ = this.actions$.pipe(
    ofType(GamesActionTypes.RequestGames),
    exhaustMap(() =>
      this.apiService.getSavedGames().pipe(
        map(games => new RequestGamesSuccessAction(games)),
        catchError(err => {
          const actions = [
            new RequestGamesFailedAction(err.error),
            new ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ];
          return from(actions);
        }),
      ),
    ),
  );
}
