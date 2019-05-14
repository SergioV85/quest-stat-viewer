import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { getLevels } from '@app-common/reducers/game-details/game-details.reducer';
import { GetMonitoringDetailsAction } from '@app-common/actions/monitoring.actions';
import { getPlayerData } from '@app-common/reducers/monitoring/monitoring.reducer';

@Component({
  selector: 'monitoring-by-user',
  templateUrl: './monitoring-by-user.component.html',
  styleUrls: ['./monitoring-by-user.component.scss'],
})
export class MonitoringByUserComponent implements OnInit, OnDestroy {
  @Input() public id: number;
  public levels$: Observable<QuestStat.LevelData[]>;
  public playerData$: Observable<{ [key: number]: Partial<{ totalData: QuestStat.Monitoring.PlayerLevelData }> }>;
  public pathToLevelId = ['_id', 'level'];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    this.store.dispatch(
      new GetMonitoringDetailsAction({
        playerId: this.id,
        detailsLevel: 'byPlayer',
      }),
    );

    this.playerData$ = this.store.pipe(
      select(getPlayerData),
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
