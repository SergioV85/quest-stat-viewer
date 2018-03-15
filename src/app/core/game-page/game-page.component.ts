import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { ApiService } from './../../common/services/api.service';
import { DeviceService } from './../../common/services/device.service';
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

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;
  public disableSaveButton = false;
  public loadData = false;
  public selectedView = 'total';
  private serverData: QuestStat.GameData;

  constructor(private route: ActivatedRoute,
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
      .catch((err) => {
        this.snackBar.open('Извините, не удалось сохранить данные', 'Скрыть', {
          politeness: 'assertive',
          duration: 1000,
          extraClasses: ['snack-error-message']
        });
        throw err;
      })
      .finally(() => {
        this.disableSaveButton = false;
      })
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
      .catch((err) => {
        this.snackBar.open('Извините, не удалось обновить данные', 'Скрыть', {
          politeness: 'assertive',
          duration: 1000,
          extraClasses: ['snack-error-message']
        });
        throw err;
      })
      .finally(() => {
        this.loadData = false;
      })
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
}
