import { TeamCardComponent } from './../team-card/team-card.component';
import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as R from 'ramda';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss']
})
export class GameTableComponent implements OnChanges {
  @Input() public set levels(levelsData: QuestStat.LevelData[]) {
    this.levelsList = levelsData;
  };
  @Input() public levelsStat: QuestStat.GroupedTeamData[];
  @Input() public set finishResults(data: { [key: string]: QuestStat.TeamData[] }) {
    this.finishList = this.sortFinishResultsColumn(data.finishResults, data.dataByTeam);
  };
  @Input() public set teamsStat(teamSt: QuestStat.GroupedTeamData[]) {
    this.dataByTeam = teamSt;
    this.teamList = this.sortTeamList(teamSt);
  };
  @Input() public selectedTab: string = 'team';
  @Output() public changeLevelType = new EventEmitter<{}>();
  @Output() public removeLevel = new EventEmitter<{}>();
  public levelsList: QuestStat.LevelData[] = [];
  public teamList: QuestStat.GroupedTeamData[] = [];
  public finishList: QuestStat.TeamData[] = [];
  public gameData: QuestStat.GameData;
  public dataByTeam: QuestStat.GroupedTeamData[];

  public ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
  }

  public isLevelRemoved(teamStat: QuestStat.TeamData): boolean {
    return R.pathOr(false, [teamStat.levelIdx, 'removed'] , this.levelsList);
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
    }

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

  private sortFinishResultsColumn(finRes: QuestStat.TeamData[], teamData: QuestStat.TeamData[]): QuestStat.TeamData[] {
    console.log('teamData', teamData);

    const closedLevels = (team: QuestStat.TeamData) => R.pipe(
      R.find(R.propEq('id', team.id)),
      R.prop('data'),
      R.length
    )(teamData);

    const calculateFullTime = (team: QuestStat.TeamData) => R.subtract(
      team.duration,
      team.additionsTime
    );

    return R.sortWith([
      R.descend(closedLevels),
      R.ascend(calculateFullTime)
    ])(finRes);
  }
}
