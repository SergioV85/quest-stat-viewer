import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { contains, indexOf, without } from 'ramda';

import { ChangeLevelTypeAction, RemoveLevelFromStatAction } from '@app-common/actions/game-details.actions';
import { getLevels, getStatData } from '@app-common/reducers/game-details/game-details.reducer';
import { getActiveTab } from '@app-common/reducers/router/router.reducer';
import { LevelType } from '@app-common/services/helpers/level-type.enum';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTableComponent implements OnInit, OnDestroy {
  public activeTab$: Observable<string>;

  public levels: QuestStat.LevelData[];
  public statData: { teams: QuestStat.TeamData[][]; levels: QuestStat.TeamData[][] };
  public LevelType = LevelType;
  private selectedTeams: number[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store<QuestStat.Store.State>) {}

  public ngOnInit() {
    this.activeTab$ = this.store.pipe(
      select(getActiveTab),
      takeUntil(this.ngUnsubscribe),
    );
    this.store
      .pipe(
        select(getLevels),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(levels => (this.levels = levels));
    this.store
      .pipe(
        select(getStatData),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(data => (this.statData = data));
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

  public changeLevelType({ type, level }: { type: number; level: number }) {
    this.store.dispatch(new ChangeLevelTypeAction({ type, level }));
  }
  public removeLevel({ removed, level }: { removed: boolean; level: number }) {
    this.store.dispatch(new RemoveLevelFromStatAction({ removed, level }));
  }
}
