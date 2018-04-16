import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as MonitoringReducer from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {
  public parsingStatus$: Observable<boolean>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) { }

  public ngOnInit() {
    this.parsingStatus$ = this.store.pipe(
      select(MonitoringReducer.dataParsed),
      takeUntil(this.ngUnsubscribe)
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
