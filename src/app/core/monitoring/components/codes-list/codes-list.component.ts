import { Component, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { pathOr, mergeRight } from 'ramda';

import { CodeEntry, State } from '@app-common/models';
import { RequestCodesAction } from '@app-core/monitoring/actions/monitoring.actions';
import { getCodes } from '@app-core/monitoring/reducers/monitoring.reducer';

@Component({
  selector: 'codes-list',
  templateUrl: './codes-list.component.html',
  styleUrls: ['./codes-list.component.scss'],
})
export class CodesListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public uniqueId = 0;
  @Input() public levelId = 0;
  @Input() public type = 'byLevel';
  @ViewChild(MatPaginator, { static: true }) public paginator?: MatPaginator;
  public dataSource = new MatTableDataSource<CodeEntry>();
  public displayedColumns = ['player', 'code', 'time', 'timeDiff'];
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<State>) {}

  public ngOnInit() {
    const request =
      this.type === 'byLevel'
        ? { teamId: this.uniqueId, levelId: this.levelId }
        : { playerId: this.uniqueId, levelId: this.levelId };

    this.store.dispatch(RequestCodesAction({ query: mergeRight(request, { type: this.type }) }));

    this.store
      .pipe(
        select(getCodes),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(codes => {
        this.dataSource.data = pathOr([], [this.uniqueId, this.levelId], codes);
      });
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator as MatPaginator;
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
