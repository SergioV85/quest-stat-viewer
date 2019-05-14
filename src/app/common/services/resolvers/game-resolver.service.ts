import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isNil, prop } from 'ramda';

import { RequestGameDetailsAction } from '@app-common/actions/game-details.actions';

@Injectable()
export class GameDataResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.getGame(route).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  private getGame(route: ActivatedRouteSnapshot) {
    const domain = route.paramMap.get('domain');
    const id = route.paramMap.get('id');

    return this.store.pipe(
      select('gameDetails'),
      tap((data: QuestStat.Store.GameDetails) => {
        if (isNil(prop('finishResults', data)) && !data.isLoading) {
          this.store.dispatch(new RequestGameDetailsAction({ domain, id }));
        }
      }),
      filter((data: QuestStat.Store.GameDetails) => !isNil(prop('finishResults', data))),
      take(1),
    );
  }
}
