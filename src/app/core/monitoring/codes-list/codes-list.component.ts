import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { equals, ifElse, isNil, merge, pathOr } from 'ramda';

import * as MonitoringActions from '@app-common/actions/monitoring.actions';
import * as MonitoringReducer from '@app-common/reducers/monitoring/monitoring.reducer';
import { equalSegments } from '@angular/router/src/url_tree';

@Component({
  selector: 'codes-list',
  templateUrl: './codes-list.component.html',
  styleUrls: ['./codes-list.component.scss']
})
export class CodesListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public uniqueId: number;
  @Input() public levelId: number;
  @Input() public type: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public codes$: Observable<{ [key: number]: QuestStat.Monitoring.CodesListResponse }>;
  public dataSource = new MatTableDataSource<QuestStat.Monitoring.CodeEntry>();
  public displayedColumns = ['player', 'code', 'time', 'timeDiff'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) { }

  public ngOnInit() {
    const request = this.type === 'byLevel'
      ? { teamId: this.uniqueId, levelId: this.levelId }
      : { playerId: this.uniqueId, levelId: this.levelId };
    const selector = this.type === 'byLevel' ? MonitoringReducer.getCodesByTeam : MonitoringReducer.getCodesByPlayer;

    this.store.dispatch(new MonitoringActions.RequestCodesAction(merge(request, { type: this.type })));

    this.codes$ = this.store.pipe(
      select(selector),
      takeUntil(this.ngUnsubscribe)
    );
    this.codes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((codes) => {
        this.dataSource.data = pathOr([], [this.uniqueId, this.levelId], codes);
      });
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
