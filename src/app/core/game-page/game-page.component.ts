import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import * as R from 'ramda';
import { ApiService } from './../../common/services/api.service';
import { DeviceService } from './../../common/services/device.service';

@Component({
  selector: 'game-page',
  templateUrl: 'game-page.component.html',
  styleUrls: ['game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  public gameData: QuestStat.GameData;
  public dataRequested: boolean;
  public errorMessage: string;
  public disableSaveButton: boolean = false;
  public loadData: boolean = false;
  public selectedView: string = 'total';
  private serverData: QuestStat.GameData;

  constructor(private route: ActivatedRoute,
              private apiService: ApiService,
              private deviceService: DeviceService,
              private snackBar: MdSnackBar) {}

  public ngOnInit() {
    const { gameData } = this.route.snapshot.data;
    this.serverData = R.clone(gameData);
    this.gameData = R.mergeDeepRight(gameData, {
      stat: {
        finishResults: this.sortFinishResults(gameData.stat.finishResults)
      }
    });
  }

  public updateLevel(updatedLevel) {
    const levelIdx = R.findIndex(R.propEq('id', updatedLevel.id))(this.gameData.stat.levels);
    const newData = R.adjust((oldLevel) => R.merge(oldLevel, updatedLevel), levelIdx, this.gameData.stat.levels);
    this.gameData.stat.levels = newData;
  }

  public get changesStatus() {
    return R.equals(
      R.map(R.prop('type'))(this.gameData.stat.levels),
      R.map(R.prop('type'))(this.serverData.stat.levels)
    );
  }

  public saveChanges() {
    this.disableSaveButton = true;
    const gameId = this.gameData.info.id;
    const levelData = R.difference(this.gameData.stat.levels, this.serverData.stat.levels);
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
        this.serverData.stat.levels = R.clone(newLevelData);
        this.gameData.stat.levels = R.clone(newLevelData);
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
        this.serverData = R.clone(data);
        this.gameData = data;
      });
  }

  public removeLevelFromStat({ removed, id }) {
    this.updateLevel({ removed, id });
    const level = R.find(R.propEq('id', id))(this.gameData.stat.levels) as QuestStat.LevelData;

    const adjustBonusTime = (teamStat) => {
      if (R.isNil(teamStat)) {
        return;
      }

      return R.merge(teamStat, {
        additionsTime: removed
          ? R.add(R.pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
          : R.subtract(R.pathOr(0, ['additionsTime'], teamStat), teamStat.duration)
      });
    };

    const updatedStatByLevels = R.pipe(
      R.find(R.propEq('id', level.position)),
      R.prop('data'),
      R.map(adjustBonusTime)
    )(this.gameData.stat.dataByLevels);

    const updatedStatByTeams = R.pipe(
      R.map(
        R.pipe(
          R.prop('data'),
          R.find((teamStat) => teamStat.levelIdx === level.position),
          adjustBonusTime,
        )
      ),
      R.filter(R.complement(R.isNil))
    )(this.gameData.stat.dataByTeam);

    const lvlIdx = R.findIndex(R.propEq('id', level.position))(this.gameData.stat.dataByLevels);

    const updateFinishResults = R.map((teamFinishResult: QuestStat.TeamData) => {
      const levelTime = R.pipe(
        R.find(R.propEq('id', teamFinishResult.id)),
        R.prop('data'),
        R.find((teamStat) => teamStat.levelIdx === level.position),
        R.pathOr(0, ['duration'])
      )(this.gameData.stat.dataByTeam);
      const newAdditionalTime = removed
        ? R.add(teamFinishResult.additionsTime, levelTime)
        : R.subtract(teamFinishResult.additionsTime, levelTime);

      return R.merge(teamFinishResult, {
        additionsTime: newAdditionalTime
      });
    }, this.gameData.stat.finishResults);

    const replaceTeamStatInList = (teamStats) => {
      const teamId = R.prop('id', R.head(teamStats));
      const indexInList = R.findIndex(R.propEq('levelIdx', lvlIdx))(teamStats);
      if (indexInList < 0) {
        return {
          id: teamId,
          data: teamStats
        };
      }
      const newStat = R.find(R.propEq('id', teamId))(updatedStatByTeams);
      return {
        id: teamId,
        data: R.update(indexInList, newStat, teamStats)
      };
    };

    const newLevelsData =
      R.adjust((oldLevel) => R.merge(oldLevel, { data: updatedStatByLevels }), lvlIdx, this.gameData.stat.dataByLevels);

    const newTeamsData = R.pipe(
      R.map(
        R.pipe(
          R.prop('data'),
          replaceTeamStatInList
        )
      ),
      R.filter(R.complement(R.isNil))
    )(this.gameData.stat.dataByTeam);

    this.gameData.stat.dataByLevels = newLevelsData;
    this.gameData.stat.dataByTeam = newTeamsData;
    this.gameData.stat.finishResults = this.sortFinishResults(updateFinishResults);
  }

  public changeViewType({ value }) {
    this.selectedView = value;
  }

  private sortFinishResults(finishStat: QuestStat.TeamData[]): QuestStat.TeamData[] {
    const closedLevels = (team: QuestStat.TeamData) => R.pipe(
      R.find(R.propEq('id', team.id)),
      R.prop('closedLevels')
    )(finishStat);

    const calculateFullTime = (team: QuestStat.TeamData) => R.subtract(
      team.duration,
      team.additionsTime
    );

    return R.sortWith([
      R.descend(closedLevels),
      R.ascend(calculateFullTime)
    ])(finishStat);
  }
}
