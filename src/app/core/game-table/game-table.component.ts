import { TeamCardComponent } from './../team-card/team-card.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as R from 'ramda';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss']
})
export class GameTableComponent {
  @Input() public levels: QuestStat.LevelData[];
  @Input() public levelsStat: QuestStat.GroupedTeamData[];
  @Input() public set teamsStat(teamSt: QuestStat.GroupedTeamData[]) {
    this.dataByTeam = teamSt;
    this.teamList = this.sortTeamList(teamSt);
    console.log('teamSt', teamSt);
    console.log('teamList', this.teamList);
  };
  @Input() public set finishResults(finRes: QuestStat.TeamData[]) {
    this.finishList = this.sortFinishResultsColumn(finRes);
  };
  @Input() public selectedTab: string = 'team';
  @Output() public changeLevelType = new EventEmitter<{}>();
  @Output() public removeLevel = new EventEmitter<{}>();
  public teamList: QuestStat.GroupedTeamData[] = [];
  public finishList: QuestStat.TeamData[] = [];
  public gameData: QuestStat.GameData;
  public dataByTeam: QuestStat.GroupedTeamData[];

  public isLevelRemoved(teamStat: QuestStat.TeamData): boolean {
    return R.pathOr(false, [teamStat.levelIdx, 'removed'] , this.levels);
  }

  private sortTeamList(sortingSource: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] {
    const closedLevelQuantity = R.pipe(
      R.prop('data'),
      R.length
    );

    const sumDurations = R.pipe(
      R.prop('data'),
      R.map((team: QuestStat.TeamData) => R.subtract(team.duration, team.additionsTime)),
      R.sum
    );

    return R.sortWith([
      R.descend(closedLevelQuantity),
      R.ascend(sumDurations)
    ])(sortingSource);
  }

  private sortFinishResultsColumn(finishResults): QuestStat.TeamData[] {
    const closedLevels = (team) => R.pipe(
      R.find(R.propEq('id', team.id)),
      R.prop('data'),
      R.length
    )(this.dataByTeam);

    const calculateFullTime = (team) => R.sum([
      team.duration,
      R.negate(R.pathOr(0, ['additionsTime', 'bonus'], team)),
      R.pathOr(0, ['additionsTime', 'penalty'], team)
    ]);

    return R.sortWith([
      R.descend(closedLevels),
      R.ascend(calculateFullTime)
    ])(finishResults);
  }
}
