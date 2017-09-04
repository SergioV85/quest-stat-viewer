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
  @Input() public set finishResults(finishResults: QuestStat.TeamData[]) {
    this.finishList = this.sortFinishResultsColumn(finishResults);
  };
  @Input() public set teamsStat(teamSt: QuestStat.GroupedTeamData[]) {
    this.teamList = this.sortTeamList(teamSt);
  };
  @Input() public selectedTab: string = 'team';
  @Output() public changeLevelType = new EventEmitter<{}>();
  @Output() public removeLevel = new EventEmitter<{}>();
  public teamList: QuestStat.GroupedTeamData[] = [];
  public finishList: QuestStat.TeamData[] = [];

  public isLevelRemoved(teamStat: QuestStat.TeamData): boolean {
    return R.pathOr(false, [teamStat.levelIdx, 'removed'] , this.levels);
  }

  private sortTeamList(sortingSource: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] {
    const closedLevelQuantity = R.pipe(
      R.prop('data'),
      R.length
    );

    const getTeamExtraBonus = (teamSource) => {
      const teamId = R.pipe(
        R.head,
        R.prop('id')
      )(teamSource);

      return R.pipe(
        R.find(R.propEq('id', teamId)),
        R.pathOr(0, ['extraBonus'])
      )(this.finishList);
    };

    const calculateFullTime = (teamSource) => {
      return R.pipe(
        R.map((team: QuestStat.TeamData) => R.subtract(team.duration, team.additionsTime)),
        R.sum,
        R.add(R.negate(R.curry(getTeamExtraBonus)((teamSource))))
      )(teamSource);
    };

    const sumDurations = R.pipe(
      R.prop('data'),
      calculateFullTime
    );

    return R.sortWith([
      R.descend(closedLevelQuantity),
      R.ascend(sumDurations)
    ])(sortingSource);
  }

  private sortFinishResultsColumn(finishResults: QuestStat.TeamData[]): QuestStat.TeamData[] {
    const closedLevels = (team: QuestStat.TeamData) => R.pipe(
      R.find(R.propEq('id', team.id)),
      R.prop('closedLevels')
    )(finishResults);

    const calculateFullTime = (team: QuestStat.TeamData) => R.subtract(
      team.duration,
      team.additionsTime
    );

    return R.sortWith([
      R.descend(closedLevels),
      R.ascend(calculateFullTime)
    ])(finishResults);
  }
}
