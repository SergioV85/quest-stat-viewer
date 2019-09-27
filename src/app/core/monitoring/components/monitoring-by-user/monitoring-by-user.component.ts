import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { State, LevelData, PlayerLevelData } from '@app-common/models';
import { getLevels } from '@app-core/game-details/reducers/game-details.reducer';
import { GetMonitoringDetailsAction } from '@app-core/monitoring/actions/monitoring.actions';
import { getPlayerData } from '@app-core/monitoring/reducers/monitoring.reducer';

@Component({
  selector: 'monitoring-by-user',
  templateUrl: './monitoring-by-user.component.html',
  styleUrls: ['./monitoring-by-user.component.scss'],
})
export class MonitoringByUserComponent implements OnInit, OnDestroy {
  @Input() public id?: number;
  public levels$?: Observable<LevelData[]>;
  public playerData$?: Observable<{ [key: number]: Partial<{ totalData: PlayerLevelData }> }>;
  public pathToLevelId = ['_id', 'level'];
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<State>) {}

  public ngOnInit() {
    this.store.dispatch(
      GetMonitoringDetailsAction({
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
