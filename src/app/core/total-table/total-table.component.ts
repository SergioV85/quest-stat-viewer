import { Component, Input } from '@angular/core';
import { MdTabChangeEvent } from '@angular/material/material';
import * as R from 'ramda';
import { LevelType } from './../../common/services/level-type.enum';
import { UtilService } from './../../common/services/util.service';

@Component({
  selector: 'total-table',
  templateUrl: 'total-table.component.html',
  styleUrls: ['total-table.component.scss']
})
export class TotalTableComponent {
  @Input() public set levels(levels: QuestStat.LevelData[]) {
    this.levelData = levels;
    this.availableTypes = R.pipe(
      R.dropLast(1),
      R.map(R.prop('type')),
      R.uniq,
      R.sort((a, b) => a - b)
    )(levels);
  };
  @Input() public set teamStat(teams: QuestStat.GroupedTeamData[]) {
    this.teamData = teams;
    this.sortTeams(R.head(this.availableTypes));
  };
  @Input() public finishResults: QuestStat.TeamData[];
  public levelData: QuestStat.LevelData[];
  public teamData: QuestStat.GroupedTeamData[];
  public availableTypes: number[];
  public sortedTeams: Array<{name: string, duration: number}> = [];

  public getLevelTypeIcon(type: number) {
    return UtilService.getLevelTypeIcon(type);
  }

  public getLevelTypeName(type: number) {
    return UtilService.getLevelTypeName(type);
  }

  public changeTab($event: MdTabChangeEvent) {
    this.sortTeams(parseInt($event.tab.textLabel, 10));
  }

  private sortTeams(selectedType: number) {
    const matchedLevels = R.pipe(
      R.filter(R.propEq('type', selectedType)),
      R.map(R.prop('position'))
    )(this.levelData);

    const calculatedStat = (team) => ({
      name: R.pipe(
        R.prop('data'),
        R.head,
        R.prop('name')
      )(team),
      duration: R.pipe(
        R.prop('data'),
        R.filter((stat) => R.contains(stat.levelIdx, matchedLevels)),
        R.map(R.prop('duration')),
        R.sum
      )(team)
    });

    this.sortedTeams = R.pipe(
      R.map(calculatedStat),
      R.sortBy(R.prop('duration'))
    )(this.teamData);
  }
}
