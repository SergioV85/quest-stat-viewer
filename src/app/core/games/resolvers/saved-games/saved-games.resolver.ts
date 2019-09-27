import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isEmpty, equals } from 'ramda';

import { State, GameInfo } from '@app-common/models';
import { RequestGamesAction } from '@app-core/games/actions/games.actions';
import { getGames } from '@app-core/games/reducers/games.reducer';

@Injectable({ providedIn: 'root' })
export class SavedGamesResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<State>) {}

  public resolve(): Observable<boolean> {
    return this.getSavedGames().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  private getSavedGames() {
    return this.store.pipe(
      select(getGames),
      distinctUntilChanged((prev, curr) => equals(prev, curr)),
      tap((data: GameInfo[]) => {
        if (isEmpty(data)) {
          this.store.dispatch(RequestGamesAction());
        }
      }),
      filter(data => !isEmpty(data)),
      take(1),
    );
  }
}
