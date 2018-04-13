import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as MonitoringReducer from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-total',
  templateUrl: './monitoring-total.component.html',
  styleUrls: ['./monitoring-total.component.scss']
})
export class MonitoringTotalComponent implements OnInit, OnDestroy {
  public totalData$: Observable<QuestStat.Monitoring.TeamGroupedData[]>;
  public pathToTeamName = ['_id', 'teamName'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) { }

  public ngOnInit() {
    this.totalData$ = this.store.pipe(
      select(MonitoringReducer.getTotalData),
      takeUntil(this.ngUnsubscribe)
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
