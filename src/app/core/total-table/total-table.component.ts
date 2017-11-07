import { Component, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/material';
import * as R from 'ramda';
import { FormatDurationPipe } from './../../common/pipes/duration-transorm.pipe';
import { LevelType } from './../../common/services/level-type.enum';
import { UtilService } from './../../common/services/util.service';

declare interface MappedTeam {
  id: number;
  name: string;
  duration: number;
}

@Component({
  selector: 'total-table',
  templateUrl: 'total-table.component.html',
  styleUrls: ['total-table.component.scss']
})
export class TotalTableComponent {
  @Input() public set levels(levels: QuestStat.LevelData[]) {
    this.levelData = levels;
    this.availableTypes = R.pipe(
      R.dropLast(1) as any,
      R.map(R.prop('type')),
      R.uniq,
      R.sort((a: number, b: number) => a - b)
    )(levels) as number[];
  }
  @Input() public set teamStat(teams: QuestStat.GroupedTeamData[]) {
    this.teamData = teams;
    this.sortTeams(R.head(this.availableTypes));
  }
  @Input() public finishResults: QuestStat.TeamData[];
  public levelData: QuestStat.LevelData[];
  public teamData: QuestStat.GroupedTeamData[];
  public availableTypes: number[];
  public sortedTeams: MappedTeam[] = [];
  private durationFormatFilter: FormatDurationPipe;

  constructor() {
    this.durationFormatFilter = new FormatDurationPipe();
  }

  public getLevelTypeIcon(type: number) {
    return UtilService.getLevelTypeIcon(type);
  }

  public getLevelTypeName(type: number) {
    return UtilService.getLevelTypeName(type);
  }

  public getTeamTotalPosition(team: MappedTeam) {
    return R.findIndex(R.propEq('id', team.id))(this.finishResults) + 1;
  }

  public getLeaderDifference(team: MappedTeam, idx: number) {
    if (idx === 0) {
      return '';
    }
    const leaderTime = R.pipe(
      R.head as any,
      R.prop('duration')
    )(this.sortedTeams) as number;
    const diff = team.duration - leaderTime;
    return `+${this.durationFormatFilter.transform(diff)}`;
  }

  public getPrevTeamDifferenceTime(team: MappedTeam, idx: number) {
    if (idx === 0) {
      return '';
    }
    const diff = this.calculatePrevTeamDiff(team, idx);
    return `+${this.durationFormatFilter.transform(diff)}`;
  }

  public getPrevTeamDifferenceClass(team: MappedTeam, idx: number) {
    if (idx === 0) {
      return '';
    }
    const diff = this.calculatePrevTeamDiff(team, idx);
    switch (true) {
      case diff < 1000:
        return 'total-table__team-prev-difference--lessThanSecond';
      case diff < 60000:
        return 'total-table__team-prev-difference--lessThanMinute';
      case diff < 3600000:
        return 'total-table__team-prev-difference--lessThanHour';
      default:
        return 'total-table__team-prev-difference--moreThanHour';
    }
  }

  public changeTab($event: MatTabChangeEvent) {
    this.sortTeams(parseInt($event.tab.textLabel, 10));
  }

  private sortTeams(selectedType: number) {
    const matchedLevels = R.pipe(
      R.filter(R.propEq('type', selectedType)),
      R.filter(R.complement(R.prop('removed'))),
      R.map(R.prop('position'))
    )(this.levelData);

    const calculatedStat = (team: QuestStat.GroupedTeamData) => ({
      name: R.pipe(
        R.prop('data'),
        R.head,
        R.prop('name')
      )(team),
      id: R.pipe(
        R.prop('data'),
        R.head,
        R.prop('id')
      )(team),
      duration: R.pipe(
        R.prop('data'),
        R.filter((stat: QuestStat.TeamData) => R.contains(stat.levelIdx, matchedLevels)) as any,
        R.map(R.prop('duration')),
        R.sum
      )(team),
      closedLevels: R.pipe(
        R.prop('data'),
        R.length
      )(team)
    });

    this.sortedTeams = R.pipe(
      R.map(calculatedStat),
      R.sortWith([
        R.descend(R.prop('closedLevels')),
        R.ascend(R.prop('duration'))
      ])
    )(this.teamData);
  }

  private calculatePrevTeamDiff(team: MappedTeam, idx: number): number {
    const prevTeamTime = R.pipe(
      R.nth(idx - 1),
      R.prop('duration')
    )(this.sortedTeams) as number;
    return team.duration - prevTeamTime;
  }
}
