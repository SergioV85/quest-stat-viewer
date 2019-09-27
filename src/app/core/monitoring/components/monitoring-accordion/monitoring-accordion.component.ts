import { Component, Input } from '@angular/core';
import { find, path, pipe, prop, propEq } from 'ramda';
import { LevelData, MonitoringLevelData, PlayerGroupedData, PlayerLevelData } from '@app-common/models';
import { UtilService } from '@app-common/services/helpers/util.service';

type MonitoringDataRow = MonitoringLevelData | PlayerLevelData;

@Component({
  selector: 'monitoring-accordion',
  templateUrl: './monitoring-accordion.component.html',
  styleUrls: ['./monitoring-accordion.component.scss'],
})
export class MonitoringAccordionComponent {
  @Input() public data: MonitoringDataRow[] = [];
  @Input() public labelPrefix = '';
  @Input() public descriptionPrefix = 'на уровне';
  @Input() public pathToLabel: string[] = [];
  @Input() public levels: LevelData[] = [];
  @Input() public groupBy = '_id';

  public getLabel(row: MonitoringDataRow): string {
    return `${this.labelPrefix} ${path(this.pathToLabel, row)}`;
  }

  public getLevelDescription(row: MonitoringDataRow): string {
    const levelId = path(['_id', 'level'], row);
    const level = find(propEq('level', levelId), this.levels) as LevelData;
    const levelType = UtilService.getLevelTypeName(level.type as number);
    return `${levelType}: ${level.name}`;
  }

  public getDescription(row: MonitoringDataRow): string {
    const percentFull = pipe(
      prop('correctCodesPercent') as (data: MonitoringDataRow) => number,
      (num: number) => num.toFixed(2),
    )(row);

    return `Уникальных кодов ${this.descriptionPrefix}: ${prop('codesCounts', row)},
    правильных: ${prop('correctCodesQuantity', row)}.
    "Успешность": ${percentFull}%`;
  }

  public getTeamId(row: MonitoringDataRow): number {
    return path(['_id', 'teamId'], row) as number;
  }
  public getPlayerId(row: MonitoringDataRow): number {
    return path(['_id', 'userId'], row) as number;
  }
  public getLevelId(row: MonitoringDataRow): number {
    return path(['_id', 'level'], row) as number;
  }
}
