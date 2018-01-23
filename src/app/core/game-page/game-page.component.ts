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
        finishResults: this.sortFinishResults(gameData.stat.finishResults)
      }
    });
  }

  public updateLevel(updatedLevel) {
    const levelIdx = findIndex(propEq('id', updatedLevel.id))(this.gameData.stat.levels);
    const newData = adjust((oldLevel) => merge(oldLevel, updatedLevel), levelIdx, this.gameData.stat.levels);
    this.gameData.stat.levels = newData;
  }

  public get changesStatus() {
    return equals(
      map(prop('type'))(this.gameData.stat.levels),
      map(prop('type'))(this.serverData.stat.levels)
    );
  }

  public saveChanges() {
    this.disableSaveButton = true;
    const gameId = this.gameData.info.id;
    const levelData = difference(this.gameData.stat.levels, this.serverData.stat.levels);
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
        this.serverData.stat.levels = clone(newLevelData) as QuestStat.LevelData[];
        this.gameData.stat.levels = clone(newLevelData) as QuestStat.LevelData[];
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

  public removeLevelFromStat({ removed, id }) {
    this.updateLevel({ removed, id });
    const level = find(propEq('id', id))(this.gameData.stat.levels) as QuestStat.LevelData;

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
          find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === level.position),
          adjustBonusTime,
        )
      ),
      filter(complement(isNil))
    )(this.gameData.stat.dataByTeam) as QuestStat.GroupedTeamData[];

    const updateFinishResults = map((teamFinishResult: QuestStat.TeamData) => {
      const levelTime = pipe(
        find(propEq('id', teamFinishResult.id)),
        prop('data'),
        find((teamStat: QuestStat.TeamData) => teamStat.levelIdx === level.position),
        pathOr(0, ['duration'])
      )(this.gameData.stat.dataByTeam);
      const newAdditionalTime = removed
        ? add(teamFinishResult.additionsTime, levelTime)
        : subtract(teamFinishResult.additionsTime, levelTime);

      return merge(teamFinishResult, {
        additionsTime: newAdditionalTime
      });
    }, this.gameData.stat.finishResults);

    const replaceTeamStatInList = (teamStats) => {
      const teamId = prop('id', head(teamStats));
      const indexInList = findIndex(propEq('levelIdx', level.position))(teamStats);
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
    )(this.gameData.stat.dataByTeam) as QuestStat.GroupedTeamData[];

    const newLevelsRowData = map((levelRow) => {
      if (level.position > levelRow.length) {
        return levelRow;
      }
      return adjust(adjustBonusTime, level.position, levelRow);
    }, this.gameData.stat.dataByLevelsRow);

    this.gameData.stat.dataByLevelsRow = newLevelsRowData;
    this.gameData.stat.dataByTeam = newTeamsData;
    this.gameData.stat.finishResults = this.sortFinishResults(updateFinishResults);
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
      team.duration,
      team.additionsTime
    );

    return sortWith([
      descend(closedLevels),
      ascend(calculateFullTime)
    ])(finishStat);
  }
}
