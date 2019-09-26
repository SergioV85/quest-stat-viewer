import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { State } from '@app-common/models';
import { RequestMonitoringAction } from '@app-common/actions/monitoring.actions';
import { dataLoaded } from '@app-common/reducers/monitoring/monitoring.reducer';

@Injectable({ providedIn: 'root' })
export class GameMonitoringResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<State>) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.getGameMonitoring(route).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  private getGameMonitoring(route: ActivatedRouteSnapshot) {
    const domain = ((route.parent as ActivatedRouteSnapshot).parent as ActivatedRouteSnapshot).paramMap.get(
      'domain',
    ) as string;
    const id = ((route.parent as ActivatedRouteSnapshot).parent as ActivatedRouteSnapshot).paramMap.get('id') as string;

    return this.store.pipe(
      select(dataLoaded),
      tap((data: boolean) => {
        if (!data) {
          this.store.dispatch(RequestMonitoringAction({ domain, id }));
        }
      }),
      filter(data => data),
      take(1),
    );
  }
}
