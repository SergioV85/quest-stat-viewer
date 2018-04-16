import { PipeTransform, Pipe } from '@angular/core';
import { head, indexOf, nth, propEq } from 'ramda';

@Pipe({ name: 'totalStatCalculation' })
export class TotalStatCalculationPipe implements PipeTransform {

  public transform (value: number[], pipeType: string, additionalParam: number | QuestStat.TeamData, idx: number) {
    if (value) {
      const team = additionalParam as QuestStat.TeamData;
      switch (pipeType) {
        case 'teamTotalPosition':
          return indexOf(additionalParam, value) + 1;
        case 'leaderDifference':
          const leaderTime = head(value);
          return team.duration - leaderTime;
        case 'prevTeamDifference':
          const prevTeamTime = nth(idx - 1, value);
          return team.duration - prevTeamTime;
        default:
          return value;
      }
    }
    return value;
  }
}
