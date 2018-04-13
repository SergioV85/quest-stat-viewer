import { Component, Input, Output, OnInit } from '@angular/core';
import { find, path, pipe, prop, propEq } from 'ramda';
import { LevelType } from '@app-common/services/helpers/level-type.enum';
import { UtilService } from '@app-common/services/helpers/util.service';

@Component({
  selector: 'monitoring-accordion',
  templateUrl: './monitoring-accordion.component.html',
  styleUrls: ['./monitoring-accordion.component.scss']
})
export class MonitoringAccordionComponent implements OnInit {
  @Input() public data;
  @Input() public labelPrefix = '';
  @Input() public descriptionPrefix = 'на уровне';
  @Input() public pathToLabel: string[];
  @Input() public levels: QuestStat.LevelData[];
  @Input() public groupBy: string;

  constructor() {}

  public ngOnInit() {}

  public getLabel(row): string {
    return `${this.labelPrefix} ${path(this.pathToLabel, row)}`;
  }

  public getLevelDescription(row): string {
    const levelId = path(['_id', 'level'], row);
    const level = find(propEq('level', levelId), this.levels);
    const levelType = UtilService.getLevelTypeName(level.type);
    return `${levelType}: ${level.name}`;
  }

  public getDescription(row): string {
    const percentFull = pipe(
      prop('correctCodesPercent'),
      (number: Number) => number.toFixed(2)
    )(row);

    return `Введено уникальных кодов ${this.descriptionPrefix}: ${prop('codesCounts', row)},
    из них правильных ${prop('correctCodesQuantity', row)}.
    Процент "успешности" ${percentFull}%`;
  }

  public getTeamId(row): number {
    return path(['_id', 'teamId'], row);
  }
  public getPlayerId(row): number {
    return path(['_id', 'userId'], row);
  }
  public getLevelId(row): number {
    return path(['_id', 'level'], row);
  }
}
