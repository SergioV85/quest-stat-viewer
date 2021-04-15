import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { from } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { State } from '@app-common/models';
import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { ApiService } from '@app-common/services/api/api.service';
import { GAME_DETAILS_ACTIONS } from '@app-core/game-details/actions/game-details.actions';

import { getGameId, getGameDomain, getLevels } from '@app-core/game-details/reducers/game-details.reducer';

@Injectable()
export class GameDetailsEffects {
  public getGameDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GAME_DETAILS_ACTIONS.requestGameDetails),
      exhaustMap(({ domain, id }) =>
        this.apiService.getGameStat({ domain, id }).pipe(
          map((data) => GAME_DETAILS_ACTIONS.requestGameDetailsSuccess({ data })),
          catchError((err) =>
            from([
              GAME_DETAILS_ACTIONS.requestGameDetailsFailed(err.error),
              NOTIFICATION_ACTIONS.errorNotification({ message: 'Извините, не удалось загрузить данные' }),
            ]),
          ),
        ),
      ),
    ),
  );

  public getGameDataFromEn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GAME_DETAILS_ACTIONS.getLatestDataFromEn),
      withLatestFrom(this.store$),
      map(([action, state]) => ({
        id: getGameId(state),
        domain: getGameDomain(state),
      })),
      map(({ domain, id }) => GAME_DETAILS_ACTIONS.requestGameDetails({ domain, id, force: true })),
    ),
  );

  public saveLevels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GAME_DETAILS_ACTIONS.saveLevelsTypes),
      withLatestFrom(this.store$),
      map(([action, state]) => ({
        gameId: getGameId(state),
        levelData: getLevels(state),
      })),
      exhaustMap(({ levelData, gameId }) =>
        this.apiService.saveLevelSettings({ gameId, levelData }).pipe(
          mergeMap((gameData) => [
            GAME_DETAILS_ACTIONS.saveLevelsTypesSuccess(),
            NOTIFICATION_ACTIONS.successNotification({ message: 'Данные сохраненны' }),
          ]),
          catchError((err) =>
            from([
              GAME_DETAILS_ACTIONS.saveLevelsTypesFailed(err.error),
              NOTIFICATION_ACTIONS.errorNotification({ message: 'Извините, не удалось сохранить данные' }),
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
