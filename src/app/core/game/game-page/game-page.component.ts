import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged, takeUntil, catchError, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import {
  add,
  adjust,
  ascend,
  clone,
  complement,
  descend,
  difference,
  equals,
  filter,
  find,
  findIndex,
  head,
  isNil,
  map,
  merge,
  mergeDeepRight,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  sortWith,
  subtract,
  update
} from 'ramda';
import { ApiService } from '@app-common/services/api/api.service';
import { DeviceService } from '@app-common/services/helpers/device.service';

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss']
})
export class GamePageComponent implements OnInit, OnDestroy {
  public tabsForm: FormGroup;
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;
  public disableSaveButton = false;
  public loadData = false;
  public selectedView = 'total';
  private serverData: QuestStat.GameData;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private apiService: ApiService,
              private deviceService: DeviceService,
              private snackBar: MatSnackBar) {}

  public ngOnInit() {
    const gameData = this.route.snapshot.data.gameData;
    this.serverData = clone(gameData);
    this.gameData = mergeDeepRight(gameData, {
      stat: {
        FinishResults: this.sortFinishResults(gameData.stat.FinishResults)
      }
    });
    this.tabsForm = this.formBuilder.group({
      activeTab: 'total'
    });
    this.tabsForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(({ activeTab }) => {
        if (activeTab !== null) {
          this.changeViewType({ value: activeTab });
        }
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public updateLevel(updatedLevel) {
    const levelIdx = findIndex(propEq('level', updatedLevel.level))(this.gameData.stat.Levels);
    const newData = adjust((oldLevel) => merge(oldLevel, updatedLevel), levelIdx, this.gameData.stat.Levels);
    this.gameData.stat.Levels = newData;
  }

  public get changesStatus() {
    return equals(
      map(prop('type'))(this.gameData.stat.Levels),
      map(prop('type'))(this.serverData.stat.Levels)
    );
  }

  public saveChanges() {
    this.disableSaveButton = true;
    const gameId = this.gameData.info.GameId;
    const levelData =  this.gameData.stat.Levels;
    this.apiService.saveLevelSettings({ gameId, levelData })
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          this.snackBar.open('Извините, не удалось сохранить данные', 'Скрыть', {
            politeness: 'assertive',
            duration: 1000,
            extraClasses: ['snack-error-message']
          });
          throw err;
        }),
        finalize(() => {
          this.disableSaveButton = false;
        })
      )
      .subscribe((newLevelData) => {
        this.snackBar.open('Данные сохраненны', 'Скрыть', {
          politeness: 'assertive',
          duration: 1000,
          extraClasses: ['snack-success-message']
        });
        this.serverData.stat.Levels = clone(levelData) as QuestStat.LevelData[];
      });
  }

  public refreshData() {
    this.loadData = true;
    const request = Object.assign({}, this.route.snapshot.params as QuestStat.GameRequest, {
      force: true
    });
    this.apiService.getGameStat(request)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((err) => {
          this.snackBar.open('Извините, не удалось обновить данные', 'Скрыть', {
            politeness: 'assertive',
            duration: 1000,
            extraClasses: ['snack-error-message']
          });
          throw err;
        }),
        finalize(() => {
          this.loadData = false;
        })
      )
      .subscribe((data: QuestStat.GameData) => {
        this.serverData = clone(data);
        this.gameData = data;
      });
  }

  public removeLevelFromStat({ removed, level }) {
    this.updateLevel({ removed, level });
    const existedLevel = find(propEq('level', level))(this.gameData.stat.Levels) as QuestStat.LevelData;

    const adjustBonusTime = (teamStat) => {
      if (isNil(teamStat)) {
        return;
      }

      return merge(teamStat, {
        additionsTime: removed
          ? add(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
          : subtract(pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
      });
    };

    const updatedStatByTeams = pipe(
      map(
        pipe(
          prop('data'),
          find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === existedLevel.position),
          adjustBonusTime,
        )
      ),
      filter(complement(isNil))
    )(this.gameData.stat.DataByTeam) as QuestStat.GroupedTeamData[];

    const updateFinishResults = map((teamFinishResult: QuestStat.TeamData) => {
      const existedAdditionsTime = propOr(0, 'additionsTime', teamFinishResult) as number;
      const levelTime = pipe(
        find(propEq('id', teamFinishResult.id)),
        prop('data'),
        find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === existedLevel.position),
        pathOr(0, ['duration'])
      )(this.gameData.stat.DataByTeam);
      const newAdditionalTime = removed
        ? add(existedAdditionsTime, levelTime)
        : subtract(existedAdditionsTime, levelTime);

      return merge(teamFinishResult, {
        additionsTime: newAdditionalTime
      });
    }, this.gameData.stat.FinishResults);

    const replaceTeamStatInList = (teamStats) => {
      const teamId = prop('id', head(teamStats) as any);
      const indexInList = findIndex(propEq('levelIdx', existedLevel.position))(teamStats);
      if (indexInList < 0) {
        return {
          id: teamId,
          data: teamStats
        };
      }
      const newStat = find(propEq('id', teamId))(updatedStatByTeams);
      return {
        id: teamId,
        data: update(indexInList, newStat, teamStats)
      };
    };

    const newTeamsData = pipe(
      map(
        pipe(
          prop('data'),
          replaceTeamStatInList
        )
      ),
      filter(complement(isNil))
    )(this.gameData.stat.DataByTeam) as QuestStat.GroupedTeamData[];

    const newLevelsRowData = map((levelRow) => {
      if (existedLevel.position > levelRow.length) {
        return levelRow;
      }
      return adjust(adjustBonusTime, existedLevel.position, levelRow);
    }, this.gameData.stat.DataByLevelsRow);

    this.gameData.stat.DataByLevelsRow = newLevelsRowData;
    this.gameData.stat.DataByTeam = newTeamsData;
    this.gameData.stat.FinishResults = this.sortFinishResults(updateFinishResults);
  }

  public changeViewType({ value }) {
    this.selectedView = value;
    console.log('changeViewType', value);
    this.router.navigate(['./', value], { relativeTo: this.route });
    if (value === 'monitoring') {
      this.getMonitoringData();
    }
  }

  private sortFinishResults(finishStat: QuestStat.TeamData[]): QuestStat.TeamData[] {
    const closedLevels = (team: QuestStat.TeamData) => pipe(
      find(propEq('id', team.id)),
      prop('closedLevels')
    )(finishStat);

    const calculateFullTime = (team: QuestStat.TeamData) => subtract(
      propOr(0, 'duration', team),
      propOr(0, 'additionsTime', team)
    );

    return sortWith([
      descend(closedLevels),
      ascend(calculateFullTime)
    ])(finishStat);
  }

  private getMonitoringData() {
    const request = Object.assign({}, this.route.snapshot.params as QuestStat.GameRequest);
    this.apiService.getMonitoringData(request)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data) => {
        console.log('Monitoring data', data);
      });
  }
}
