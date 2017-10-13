import { Component, Input } from '@angular/core';
import { MdTabChangeEvent } from '@angular/material/material';
import { sort, uniq, map, dropLast, pipe, prop, head, findIndex, propEq, filter, complement } from 'ramda';
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
    this.availableTypes = pipe(
      dropLast(1),
      map(prop('type')),
      uniq,
      sort((a: number, b: number) => a - b)
    )(levels);
  };
  @Input() public set teamStat(teams: QuestStat.GroupedTeamData[]) {
    this.teamData = teams;
    this.sortTeams(head(this.availableTypes));
  };
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
    return findIndex(propEq('id', team.id))(this.finishResults) + 1;
  }

  public getLeaderDifference(team: MappedTeam, idx: number) {
    if (idx === 0) {
      return '';
    }
    const leaderTime = pipe(
      head,
      prop('duration')
    )(this.sortedTeams);
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

  public changeTab($event: MdTabChangeEvent) {
    this.sortTeams(parseInt($event.tab.textLabel, 10));
  }

  private sortTeams(selectedType: number) {
    const matchedLevels = pipe(
      filter(propEq('type', selectedType)),
      filter(complement(R.prop('removed'))),
      map(prop('position'))
    )(this.levelData);

    const calculatedStat = (team) => ({
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
        R.filter((stat) => R.contains(stat.levelIdx, matchedLevels)),
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
    )(this.sortedTeams);
    return team.duration - prevTeamTime;
  }
}
