import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { MonitoringTeamDetailedData, State, LevelData } from '@app-common/models';
import { getLevels } from '@app-core/game-details/reducers/game-details.reducer';
import { GetMonitoringDetailsAction } from '@app-core/monitoring/actions/monitoring.actions';
import { getTeamData } from '@app-core/monitoring/reducers/monitoring.reducer';

@Component({
  selector: 'monitoring-by-team',
  templateUrl: './monitoring-by-team.component.html',
  styleUrls: ['./monitoring-by-team.component.scss'],
})
export class MonitoringByTeamComponent implements OnInit, OnDestroy {
  @Input() public id?: number;
  public levels$?: Observable<LevelData[]>;
  public teamData$?: Observable<{ [key: number]: MonitoringTeamDetailedData }>;
  public pathToLevelId = ['_id', 'level'];
  public pathToUserName = ['_id', 'userName'];
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(
      GetMonitoringDetailsAction({
        teamId: this.id,
        detailsLevel: 'byTeam',
      }),
    );

    this.teamData$ = this.store.pipe(
      select(getTeamData),
      takeUntil(this.ngUnsubscribe),
    );
    this.levels$ = this.store.pipe(
      select(getLevels),
      takeUntil(this.ngUnsubscribe),
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
