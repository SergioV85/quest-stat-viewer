import { PipeTransform, Pipe } from '@angular/core';
import { pathOr } from 'ramda';
import { LevelData, TeamData } from '@app-common/models';

@Pipe({ name: 'checkLevelRemoval' })
export class CheckLevelRemovalPipe implements PipeTransform {
  public transform(levels: LevelData[], team: TeamData) {
    if (levels && team.levelIdx) {
      return pathOr(false, [team.levelIdx, 'removed'], levels);
    }
    return false;
  }
}
