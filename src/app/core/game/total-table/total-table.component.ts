import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/material';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { ChangeTotalStatTabAction } from '@app-common/actions/game-details.actions';
import {
  getActiveTabOnTotalStatState,
  getAvailableLevelTypes,
  getFinishResults,
  getSortedTeamsTotalResulst,
} from '@app-common/reducers/game-details/game-details.reducer';

import { UtilService } from '@app-common/services/helpers/util.service';

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
  public activeTab$: Observable<number>;
  public availableTypes$: Observable<number[]>;
  public finishResults$: Observable<QuestStat.TeamData[]>;
  public sortedTeams$: Observable<MappedTeam[]>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store$: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    this.activeTab$ = this.store$.pipe(
      select(getActiveTabOnTotalStatState),
      takeUntil(this.ngUnsubscribe),
    );
    this.availableTypes$ = this.store$.pipe(
      select(getAvailableLevelTypes),
      takeUntil(this.ngUnsubscribe),
    );
    this.finishResults$ = this.store$.pipe(
      select(getFinishResults),
      takeUntil(this.ngUnsubscribe),
    );
    this.sortedTeams$ = this.store$.pipe(
      select(getSortedTeamsTotalResulst),
      takeUntil(this.ngUnsubscribe),
    );
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getLevelTypeIcon(type: number) {
    return UtilService.getLevelTypeIcon(type);
  }

  public getLevelTypeName(type: number) {
    return UtilService.getLevelTypeName(type);
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
    this.store$.dispatch(new ChangeTotalStatTabAction(newTab));
  }

  public trackByTeamId(index: number, item: MappedTeam) {
    return item.id;
  }
}
