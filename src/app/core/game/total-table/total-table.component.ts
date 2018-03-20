import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/material';

import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { Store, select } from '@ngrx/store';

import {
  ascend,
  complement,
  contains,
  descend,
  dropLast,
  filter,
  findIndex,
  head,
  length,
  map,
  nth,
  pipe,
  prop,
  propEq,
  sort,
  sortWith,
  sum,
  uniq
} from 'ramda';
import * as GameDetailsActions from '@app-common/actions/game-details.actions';
import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';

import { LevelType } from '@app-common/services/helpers/level-type.enum';
import { UtilService } from '@app-common/services/helpers/util.service';

declare interface MappedTeam {
  id: number;
  name: string;
  duration: number;
}

@Component({
  selector: 'total-table',
  templateUrl: 'total-table.component.html',
  styleUrls: ['total-table.component.scss']
})
export class TotalTableComponent implements OnInit, OnDestroy {
  public activeTab$: Observable<number>;
  public availableTypes$: Observable<number[]>;
  public finishResults$: Observable<QuestStat.TeamData[]>;
  public sortedTeams$: Observable<MappedTeam[]>;
  public sortedTeams: MappedTeam[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) {
  }

  public ngOnInit() {
    this.activeTab$ = this.store.pipe(
      select(GameDetailsReducer.getActiveTabOnTotalStatState),
      takeUntil(this.ngUnsubscribe)
    );
    this.availableTypes$ = this.store.pipe(
      select(GameDetailsReducer.getAvailableLevelTypes),
      takeUntil(this.ngUnsubscribe)
    );
    this.finishResults$ = this.store.pipe(
      select(GameDetailsReducer.getFinishResults),
      takeUntil(this.ngUnsubscribe)
    );
    this.sortedTeams$ = this.store.pipe(
      select(GameDetailsReducer.getSortedTeamsTotalResulst),
      takeUntil(this.ngUnsubscribe)
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
    this.store.dispatch(new GameDetailsActions.ChangeTotalStatTabAction(newTab));
  }

  public trackByTeamId(index, item: MappedTeam) {
    return item.id;
  }
}
