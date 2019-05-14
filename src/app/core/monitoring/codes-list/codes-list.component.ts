import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { merge, pathOr } from 'ramda';

import { RequestCodesAction } from '@app-common/actions/monitoring.actions';
import { getCodesByTeam, getCodesByPlayer } from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'codes-list',
  templateUrl: './codes-list.component.html',
  styleUrls: ['./codes-list.component.scss'],
})
export class CodesListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public uniqueId: number;
  @Input() public levelId: number;
  @Input() public type: string;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  public dataSource = new MatTableDataSource<QuestStat.Monitoring.CodeEntry>();
  public displayedColumns = ['player', 'code', 'time', 'timeDiff'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    const request =
      this.type === 'byLevel'
        ? { teamId: this.uniqueId, levelId: this.levelId }
        : { playerId: this.uniqueId, levelId: this.levelId };
    const selector = this.type === 'byLevel' ? getCodesByTeam : getCodesByPlayer;

    this.store.dispatch(new RequestCodesAction(merge(request, { type: this.type })));

    this.store
      .pipe(
        select(selector),
        takeUntil(this.ngUnsubscribe),
      )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(codes => {
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
