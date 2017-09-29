import { TeamCardComponent } from './../team-card/team-card.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as R from 'ramda';
import { LevelType } from './../../common/services/level-type.enum';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss']
})
export class GameTableComponent {
  @Input() public levels: QuestStat.LevelData[];
  @Input() public levelsStat: QuestStat.GroupedTeamData[];
  @Input() public finishList: QuestStat.TeamData[];
  @Input() public set teamsStat(teamSt: QuestStat.GroupedTeamData[]) {
    this.teamList = this.sortTeamList(teamSt);
  };
  @Input() public selectedTab: string = 'team';
  @Output() public changeLevelType = new EventEmitter<{}>();
  @Output() public removeLevel = new EventEmitter<{}>();
  public teamList: QuestStat.GroupedTeamData[] = [];
  public LevelType = LevelType;

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
}
