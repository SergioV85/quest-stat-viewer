import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { prop } from 'ramda';

import { RequestMonitoringAction } from '@app-common/actions/monitoring.actions';

@Injectable()
export class GameMonitoringResolver implements Resolve<boolean> {
  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.getGameMonitoring(route).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }

  private getGameMonitoring(route: ActivatedRouteSnapshot) {
    const domain = route.parent.parent.paramMap.get('domain');
    const id = route.parent.parent.paramMap.get('id');

    return this.store.pipe(
      select('monitoring'),
      tap((data: QuestStat.Store.Monitoring) => {
        if (!prop('dataLoaded', data) && !data.isLoading) {
          this.store.dispatch(new RequestMonitoringAction({ domain, id }));
        }
      }),
      filter((data: QuestStat.Store.Monitoring) => prop('dataLoaded', data)),
      take(1),
    );
  }
}
