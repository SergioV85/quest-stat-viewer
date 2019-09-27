import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isNil } from 'ramda';

import { State, TeamData } from '@app-common/models';
import { RequestGameDetailsAction } from '@app-core/game-details/actions/game-details.actions';
import { getFinishResults } from '@app-core/game-details/reducers/game-details.reducer';

@Injectable({ providedIn: 'root' })
export class GameDataResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<State>) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.getGame(route).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  private getGame(route: ActivatedRouteSnapshot) {
    const domain = route.paramMap.get('domain') as string;
    const id = route.paramMap.get('id') as string;

    return this.store.pipe(
      select(getFinishResults),
      tap((data: TeamData[] | null) => {
        if (isNil(data)) {
          this.store.dispatch(RequestGameDetailsAction({ domain, id }));
        }
      }),
      filter((data: TeamData[] | null) => !isNil(data)),
      take(1),
    );
  }
}
