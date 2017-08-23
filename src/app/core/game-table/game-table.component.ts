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
  constructor() {}

  public ngOnInit() {
    this.resortTeamList();
  }

  public resortTeamList() {
    const closedLevelQuantity = R.pipe(
      R.prop('data'),
      R.length
    );

    const sumDurations = R.pipe(
      R.prop('data'),
      R.map((team) => team.duration),
      R.sum
    );

    this.teamList = R.sortWith([
      R.descend(closedLevelQuantity),
      R.ascend(sumDurations)
    ])(this.data.stat.dataByTeam);
  }
}
