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
  @Input() public finishList: QuestStat.TeamData[];
  @Input() public set teamsStat(teamSt: QuestStat.GroupedTeamData[]) {
    this.teamList = R.pipe(
      this.sortTeamList.bind(this),
      this.appendFinishStatToTeam.bind(this)
    )(teamSt);
  };
  @Input() public set levelsStatRow(levelSt: QuestStat.TeamData[][]){
    this.levelStatList = this.appendFinishStat(levelSt);
  };
  @Input() public selectedTab: string = 'team';
  @Output() public changeLevelType = new EventEmitter<{}>();
  @Output() public removeLevel = new EventEmitter<{}>();
  public teamList: QuestStat.GroupedTeamData[] = [];
  public levelStatList: QuestStat.TeamData[][] = [];
  public LevelType = LevelType;
  private selectedTeams: number[] = [];

  public isLevelRemoved(teamStat: QuestStat.TeamData): boolean {
    return R.pathOr(false, [teamStat.levelIdx, 'removed'] , this.levels);
  }

  public getTeamSelectionCssClass(teamStat: QuestStat.TeamData) {
    return R.contains(teamStat.id, this.selectedTeams)
      ? `gameTable__team--selected gameTable__team--selection-${R.indexOf(teamStat.id, this.selectedTeams) + 1}`
      : '';
  }
  public toggleTeamSelection(teamStat: QuestStat.TeamData) {
    if (R.contains(teamStat.id, this.selectedTeams)) {
      this.selectedTeams = R.without([teamStat.id], this.selectedTeams);
    } else {
      this.selectedTeams.push(teamStat.id);
    }
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

  private appendFinishStatToTeam(sortedTeamStat: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] {
    return R.map((team) => {
      const finishResult = R.find(R.propEq('id', team.id), this.finishList);
      const updatedStat = R.append(finishResult, team.data);
      return {
        id: team.id,
        data: updatedStat
      };
    }, sortedTeamStat);
  }
  private appendFinishStat(levelsStat: QuestStat.TeamData[][]): QuestStat.TeamData[][] {
    const indexedMap = R.addIndex(R.map);
    return indexedMap((levelRow, indx) => R.append(this.finishList[indx], levelRow), levelsStat);
  }
}
