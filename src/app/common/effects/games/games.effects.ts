import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';

import { ApiService } from '@app-common/services/api/api.service';
import {
  RequestGamesAction,
  RequestGamesSuccessAction,
  RequestGamesFailedAction,
} from '@app-common/actions/games.actions';
import { ErrorNotificationAction } from '@app-common/actions/notification.actions';

@Injectable()
export class GamesEffects {
  constructor(private readonly actions$: Actions, private readonly apiService: ApiService) {}

  @Effect()
  public getGames$ = this.actions$.pipe(
    ofType(RequestGamesAction),
    exhaustMap(() =>
      this.apiService.getSavedGames().pipe(
        map(data => RequestGamesSuccessAction({ data })),
        catchError(err =>
          from([
            RequestGamesFailedAction(err.error),
            ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' }),
          ]),
        ),
      ),
    ),
  );
}
