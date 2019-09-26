import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isNil } from 'ramda';

import { RequestGameDetailsAction } from '@app-common/actions/game-details.actions';
import { getFinishResults } from 'app/common/reducers/game-details/game-details.reducer';
import { State, TeamData } from '@app-common/models';

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
      tap((data: TeamData[]) => {
        if (isNil(data)) {
          this.store.dispatch(RequestGameDetailsAction({ domain, id }));
        }
      }),
      filter((data: TeamData[]) => !isNil(data)),
      take(1),
    );
  }
}
