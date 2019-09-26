import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { getParsingStat } from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-loader',
  templateUrl: './monitoring-loader.component.html',
  styleUrls: ['./monitoring-loader.component.scss'],
})
export class MonitoringLoaderComponent implements OnInit, OnDestroy {
  public parsingStat$?: Observable<Partial<{ pagesLeft: number; pageSaved: number; totalPages: number }>>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    this.parsingStat$ = this.store.pipe(
      select(getParsingStat),
      takeUntil(this.ngUnsubscribe),
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
