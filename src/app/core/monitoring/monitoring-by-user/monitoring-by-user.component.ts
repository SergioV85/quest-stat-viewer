import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';
import * as MonitoringActions from '@app-common/actions/monitoring.actions';
import * as MonitoringReducer from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-by-user',
  templateUrl: './monitoring-by-user.component.html',
  styleUrls: ['./monitoring-by-user.component.scss']
})
export class MonitoringByUserComponent implements OnInit, OnDestroy {
  @Input() public id: number;
  public levels$: Observable<QuestStat.LevelData[]>;
  public playerData$: Observable<{ [key: number]: Partial<{ totalData: QuestStat.Monitoring.PlayerLevelData}> }>;
  public pathToLevelId = ['_id', 'level'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) { }

  public ngOnInit() {
    this.store.dispatch(new MonitoringActions.GetMonitoringDetailsAction({
      playerId: this.id,
      detailsLevel: 'byPlayer'
    }));

    this.playerData$ = this.store.pipe(
      select(MonitoringReducer.getPlayerData),
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
