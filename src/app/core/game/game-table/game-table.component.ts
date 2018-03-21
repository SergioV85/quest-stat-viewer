import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Store, select } from '@ngrx/store';

import {
  contains,
  indexOf,
  without
} from 'ramda';

import * as GameDetailsActions from '@app-common/actions/game-details.actions';
import * as GameDetailsReducer from '@app-common/reducers/game-details/game-details.reducer';
import * as RouterReducer from '@app-common/reducers/router/router.reducer';
import { LevelType } from '@app-common/services/helpers/level-type.enum';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameTableComponent implements OnInit, OnDestroy {
  // @Output() public changeLevelType = new EventEmitter<{}>();
  // @Output() public removeLevel = new EventEmitter<{}>();
  public activeTab$: Observable<string>;
  public levels$: Observable<QuestStat.LevelData[]>;
  public statData$: Observable<{ teams: QuestStat.TeamData[][], levels: QuestStat.TeamData[][] }>;

  public levels: QuestStat.LevelData[];
  public statData: { teams: QuestStat.TeamData[][], levels: QuestStat.TeamData[][] };
  public LevelType = LevelType;
  private selectedTeams: number[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    this.activeTab$ = this.store.pipe(
      select(RouterReducer.getActiveTab),
      takeUntil(this.ngUnsubscribe)
    );
    this.levels$ = this.store.pipe(
      select(GameDetailsReducer.getLevels),
      takeUntil(this.ngUnsubscribe)
    );
    this.levels$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((levels) => this.levels = levels);
    this.statData$ = this.store.pipe(
      select(GameDetailsReducer.getStatData),
      takeUntil(this.ngUnsubscribe)
    );
    this.statData$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => this.statData = data);
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getTeamSelectionCssClass(teamStat: QuestStat.TeamData) {
    return contains(teamStat.id, this.selectedTeams)
      ? `gameTable__team--selected gameTable__team--selection-${indexOf(teamStat.id, this.selectedTeams) + 1}`
      : '';
  }
  public toggleTeamSelection(teamStat: QuestStat.TeamData) {
    if (contains(teamStat.id, this.selectedTeams)) {
      this.selectedTeams = without([teamStat.id], this.selectedTeams);
    } else {
      this.selectedTeams.push(teamStat.id);
    }
  }

  public changeLevelType({ type, level }: { type: number, level: number }) {
    this.store.dispatch(new GameDetailsActions.ChangeLevelTypeAction({ type, level }));
  }
  public removeLevel({ removed, level }: { removed: boolean, level: number }) {
    this.store.dispatch(new GameDetailsActions.RemoveLevelFromStatAction({ removed, level }));
  }
}
