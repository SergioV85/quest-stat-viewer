import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isNil, prop } from 'ramda';

import { RequestGamesAction } from '@app-common/actions/games.actions';

@Injectable()
export class SavedGamesResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public resolve(): Observable<boolean> {
    return this.getSavedGames().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  private getSavedGames() {
    return this.store.pipe(
      select('games'),
      tap((data: QuestStat.Store.Games) => {
        if (isNil(prop('games', data)) && !data.isLoading) {
          this.store.dispatch(new RequestGamesAction());
        }
      }),
      filter((data: QuestStat.Store.Games) => !isNil(prop('games', data))),
      take(1),
    );
  }
}
