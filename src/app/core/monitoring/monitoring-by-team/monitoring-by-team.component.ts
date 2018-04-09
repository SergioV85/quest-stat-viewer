import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';
import * as MonitoringReducer from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-by-team',
  templateUrl: './monitoring-by-team.component.html',
  styleUrls: ['./monitoring-by-team.component.scss']
})
export class MonitoringByTeamComponent implements OnInit, OnDestroy {
  @Input() public id: number;
  public levels$: Observable<QuestStat.LevelData[]>;
  public teamData$: Observable<QuestStat.Monitoring.TotalData[]>;
  public pathToLevelId = ['_id', 'level'];
  public pathToUserName = ['_id', 'userName'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) { }

  public ngOnInit() {
    this.store.dispatch(new MonitoringActions.GetMonitoringDetailsAction({
      teamId: this.id,
      detailsLevel: 'byTeam'
    }));

    this.teamData$ = this.store.pipe(
      select(MonitoringReducer.getTeamData),
      takeUntil(this.ngUnsubscribe)
    );
    this.levels$ = this.store.pipe(
      select(GameDetailsReducer.getLevels),
      takeUntil(this.ngUnsubscribe)
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
