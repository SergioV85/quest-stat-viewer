import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { getLevels } from '@app-common/reducers/game-details/game-details.reducer';
import { GetMonitoringDetailsAction } from '@app-common/actions/monitoring.actions';
import { getTeamData } from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-by-team',
  templateUrl: './monitoring-by-team.component.html',
  styleUrls: ['./monitoring-by-team.component.scss'],
})
export class MonitoringByTeamComponent implements OnInit, OnDestroy {
  @Input() public id: number;
  public levels$: Observable<QuestStat.LevelData[]>;
  public teamData$: Observable<{ [key: number]: QuestStat.Monitoring.TeamDetailedData }>;
  public pathToLevelId = ['_id', 'level'];
  public pathToUserName = ['_id', 'userName'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    this.store.dispatch(
      new GetMonitoringDetailsAction({
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
