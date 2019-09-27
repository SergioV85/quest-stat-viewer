import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { MonitoringTeamGroupedData, State } from '@app-common/models';
import { getTotalData } from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-total',
  templateUrl: './monitoring-total.component.html',
  styleUrls: ['./monitoring-total.component.scss'],
})
export class MonitoringTotalComponent implements OnInit, OnDestroy {
  public totalData$?: Observable<MonitoringTeamGroupedData[]>;
  public pathToTeamName = ['_id', 'teamName'];
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<State>) {}

  public ngOnInit() {
    this.totalData$ = this.store.pipe(
      select(getTotalData),
      takeUntil(this.ngUnsubscribe),
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
