import { PipeTransform, Pipe } from '@angular/core';
import { pathOr } from 'ramda';

@Pipe({ name: 'checkLevelRemoval' })
export class CheckLevelRemovalPipe implements PipeTransform {
  public transform(levels: QuestStat.LevelData[], team: QuestStat.TeamData) {
    if (levels && team.levelIdx) {
      return pathOr(false, [team.levelIdx, 'removed'], levels);
    }
    return false;
  }
}
