import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { TeamData, State } from '@app-common/models';
import { isNotNullOrUndefined, getLevelTypeIcon, getLevelTypeName } from '@app-common/services/util/util.metods';
import { GAME_DETAILS_ACTIONS } from '@app-core/game-details/actions/game-details.actions';
import {
  getActiveTabOnTotalStatState,
  getAvailableLevelTypes,
  getFinishResults,
  getSortedTeamsTotalResults,
} from '@app-core/game-details/reducers/game-details.reducer';

declare interface MappedTeam {
  id: number;
  name: string;
  duration: number;
}

@Component({
  selector: 'total-table',
  templateUrl: 'total-table.component.html',
  styleUrls: ['total-table.component.scss'],
})
export class TotalTableComponent implements OnInit, OnDestroy {
  public activeTab$?: Observable<number>;
  public availableTypes$?: Observable<number[]>;
  public finishResults$?: Observable<TeamData[]>;
  public sortedTeams$?: Observable<MappedTeam[]>;
  private readonly ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store$: Store<State>) {}

  public ngOnInit() {
    this.activeTab$ = this.store$.pipe(
      select(getActiveTabOnTotalStatState),
      filter(isNotNullOrUndefined),
      takeUntil(this.ngUnsubscribe),
    );
    this.availableTypes$ = this.store$.pipe(select(getAvailableLevelTypes), takeUntil(this.ngUnsubscribe));
    this.finishResults$ = this.store$.pipe(
      select(getFinishResults),
      filter(isNotNullOrUndefined),
      takeUntil(this.ngUnsubscribe),
    );
    this.sortedTeams$ = this.store$.pipe(
      select(getSortedTeamsTotalResults),
      filter(isNotNullOrUndefined),
      takeUntil(this.ngUnsubscribe),
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getLevelTypeIcon(type: number) {
    return getLevelTypeIcon(type);
  }

  public getLevelTypeName(type: number) {
    return getLevelTypeName(type);
  }

  public getPrevTeamDifferenceClass(diff: number) {
    switch (true) {
      case diff < 1000:
        return 'total-table__team-prev-difference--lessThanSecond';
      case diff < 60000:
        return 'total-table__team-prev-difference--lessThanMinute';
      case diff < 3600000:
        return 'total-table__team-prev-difference--lessThanHour';
      default:
        return 'total-table__team-prev-difference--moreThanHour';
    }
  }

  public changeTab($event: MatTabChangeEvent) {
    const newTab = parseInt($event.tab.textLabel, 10);
    this.store$.dispatch(GAME_DETAILS_ACTIONS.changeTotalStatTab({ tab: newTab }));
  }

  public trackByTeamId(index: number, item: MappedTeam) {
    return item.id;
  }
}
