import { TeamCardComponent } from './../team-card/team-card.component';
import { Component, Input, OnInit } from '@angular/core';
import * as R from 'ramda';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss']
})
export class GameTableComponent implements OnInit {
  @Input() public data: QuestStat.GameData;
  public teamList: QuestStat.GroupedTeamData[] = [];
  public finishList: QuestStat.TeamData[] = [];

  public ngOnInit() {
    this.teamList = this.sortTeamList(this.data.stat.dataByTeam);
    this.finishList = this.sortFinishResultsColumn(this.data.stat.finishResults);
  }

  public isLevelRemoved(teamStat: QuestStat.TeamData): boolean {
    return R.pathOr(false, ['stat', 'levels', teamStat.levelIdx, 'removed'] , this.data);
  }

  private sortTeamList(sortingSource: QuestStat.GroupedTeamData[]): QuestStat.GroupedTeamData[] {
    const closedLevelQuantity = R.pipe(
      R.prop('data'),
      R.length
    );

    const sumDurations = R.pipe(
      R.prop('data'),
      R.map((team) => team.duration),
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
    )(this.data.stat.dataByTeam);

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
