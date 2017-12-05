import { TeamCardComponent } from './../team-card/team-card.component';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LevelType } from './../../common/services/level-type.enum';
import {
  add,
  addIndex,
  append,
  ascend,
  contains,
  curry,
  descend,
  find,
  head,
  indexOf,
  length,
  map,
  negate,
  nth,
  pathOr,
  pipe,
  prop,
  propEq,
  sortWith,
  subtract,
  sum,
  without
} from 'ramda';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss']
})
export class GameTableComponent {
  @Input() public levels: QuestStat.LevelData[];
  @Input() public finishList: QuestStat.TeamData[];
  @Input() public set teamsStat(teamSt: QuestStat.GroupedTeamData[]) {
    this.teamList = pipe(
      this.sortTeamList.bind(this),
      this.appendFinishStatToTeam.bind(this)
    )(teamSt) as QuestStat.GroupedTeamData[];
  }
  @Input() public set levelsStatRow(levelSt: QuestStat.TeamData[][]){
    this.levelStatList = this.appendFinishStat(levelSt);
  }
  @Input() public selectedTab = 'team';
  @Output() public changeLevelType = new EventEmitter<{}>();
  @Output() public removeLevel = new EventEmitter<{}>();
  public teamList: QuestStat.GroupedTeamData[] = [];
  public levelStatList: QuestStat.TeamData[][] = [];
  public LevelType = LevelType;
  private selectedTeams: number[] = [];

  public isLevelRemoved(teamStat: QuestStat.TeamData): boolean {
    return pathOr(false, [teamStat.levelIdx, 'removed'] , this.levels);
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

  private sortTeamList(sortingSource: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] {
    const closedLevelQuantity = pipe(
      prop('data'),
      length
    );

    const getTeamExtraBonus = (teamSource): number => {
      const teamId = pipe(
        nth(0),
        prop('id')
      )(teamSource);

      return pipe(
        find(propEq('id', teamId)),
        pathOr(0, ['extraBonus'])
      )(this.finishList) as number;
    };

    const calculateFullTime = (teamSource: QuestStat.TeamData[]) => {
      return pipe(
        map((team: QuestStat.TeamData) => subtract(team.duration, team.additionsTime)),
        sum,
        add(negate(curry(getTeamExtraBonus)((teamSource)) as any))
      )(teamSource);
    };

    const sumDurations = pipe(
      prop('data'),
      calculateFullTime
    );

    return sortWith([
      descend(closedLevelQuantity),
      ascend(sumDurations)
    ])(sortingSource) as QuestStat.GroupedTeamData[];
  }

  private appendFinishStatToTeam(sortedTeamStat: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] {
    return map((team) => {
      const finishResult = find(propEq('id', team.id), this.finishList);
      const updatedStat = append(finishResult, team.data);
      return {
        id: team.id,
        data: updatedStat
      };
    }, sortedTeamStat);
  }
  private appendFinishStat(levelsStat: QuestStat.TeamData[][]): QuestStat.TeamData[][] {
    const indexedMap = addIndex(map);
    return indexedMap((levelRow, indx) => append(this.finishList[indx], levelRow), levelsStat);
  }
}
