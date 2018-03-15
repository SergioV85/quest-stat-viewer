import { Component, Input } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/material';

import { FormatDurationPipe } from './../../common/pipes/duration-transorm.pipe';
import { LevelType } from './../../common/services/level-type.enum';
import { UtilService } from './../../common/services/util.service';
import {
  ascend,
  complement,
  contains,
  descend,
  dropLast,
  filter,
  findIndex,
  head,
  length,
  map,
  nth,
  pipe,
  prop,
  propEq,
  sort,
  sortWith,
  sum,
  uniq
} from 'ramda';

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
      dropLast(1) as any,
      map(prop('type')),
      uniq,
      sort((a: number, b: number) => a - b) as any
    )(levels) as number[];
  }
  @Input() public set teamStat(teams: QuestStat.GroupedTeamData[]) {
    this.teamData = teams;
    this.sortTeams(head(this.availableTypes));
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
    return findIndex(propEq('id', team.id))(this.finishResults) + 1;
  }

  public getLeaderDifference(team: MappedTeam, idx: number) {
    if (idx === 0) {
      return '';
    }
    const leaderTime = pipe(
      head as any,
      prop('duration')
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
    const matchedLevels = pipe(
      filter(propEq('type', selectedType)),
      filter(complement(prop('removed'))),
      map(prop('position'))
    )(this.levelData);

    const calculatedStat = (team: QuestStat.GroupedTeamData) => ({
      name: pipe(
        prop('data'),
        nth(0),
        prop('name')
      )(team) as string,
      id: pipe(
        prop('data'),
        nth(0),
        prop('id')
      )(team) as number,
      duration: pipe(
        prop('data'),
        filter((stat: QuestStat.TeamData) => contains(stat.levelIdx, matchedLevels)) as any,
        map(prop('duration')) as any,
        sum
      )(team) as number,
      closedLevels: pipe(
        prop('data'),
        length
      )(team)
    });

    this.sortedTeams = pipe(
      map(calculatedStat),
      sortWith([
        descend(prop('closedLevels')),
        ascend(prop('duration'))
      ])
    )(this.teamData);
  }

  private calculatePrevTeamDiff(team: MappedTeam, idx: number): number {
    const prevTeamTime = pipe(
      nth(idx - 1),
      prop('duration')
    )(this.sortedTeams) as number;
    return team.duration - prevTeamTime;
  }
}
