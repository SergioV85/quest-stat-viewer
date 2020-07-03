import { PipeTransform, Pipe } from '@angular/core';
import { head, indexOf, nth } from 'ramda';
import { TeamData } from '@app-common/models';

@Pipe({ name: 'totalStatCalculation' })
export class TotalStatCalculationPipe implements PipeTransform {
  public transform(value: number[], pipeType: string, additionalParam: number | TeamData, idx: number) {
    if (value) {
      const team = additionalParam as TeamData;
      switch (pipeType) {
        case 'teamTotalPosition':
          return indexOf(additionalParam, value) + 1;
        case 'leaderDifference':
          const leaderTime = head(value) as number;
          return team.duration - leaderTime;
        case 'prevTeamDifference':
          const prevTeamTime = nth(idx - 1, value) as number;
          return team.duration - prevTeamTime;
        default:
          return value;
      }
    }
    return value;
  }
}
