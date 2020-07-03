import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { State, MonitoringTeamGroupedData } from '@app-common/models';
import { isDataParsed, getParsingStat, getTotalData } from '@app-core/monitoring/reducers/monitoring.reducer';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss'],
})
export class MonitoringComponent implements OnInit, OnDestroy {
  public isDataParsed$?: Observable<boolean>;
  public parsingStat$?: Observable<Partial<{ pagesLeft: number; pageSaved: number; totalPages: number }>>;
  public totalData$?: Observable<MonitoringTeamGroupedData[]>;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<State>) {}

  public ngOnInit() {
    this.isDataParsed$ = this.store.pipe(select(isDataParsed), takeUntil(this.ngUnsubscribe));
    this.parsingStat$ = this.store.pipe(select(getParsingStat), takeUntil(this.ngUnsubscribe));
    this.totalData$ = this.store.pipe(select(getTotalData), takeUntil(this.ngUnsubscribe));
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
