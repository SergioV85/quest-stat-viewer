import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as MonitoringReducer from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-loader',
  templateUrl: './monitoring-loader.component.html',
  styleUrls: ['./monitoring-loader.component.scss']
})
export class MonitoringLoaderComponent implements OnInit, OnDestroy {
  public parsingStat$: Observable<{}>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) { }

  public ngOnInit() {
    this.parsingStat$ = this.store.pipe(
      select(MonitoringReducer.getParsingStat),
      takeUntil(this.ngUnsubscribe)
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
