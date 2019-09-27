import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { LevelData, LevelType } from '@app-common/models';
import { getLevelTypeIcon, getLevelTypeName } from '@app-common/services/util/util.metods';

@Component({
  selector: 'level-card',
  templateUrl: 'level-card.component.html',
  styleUrls: ['level-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCardComponent {
  @Input() public set levelInfo(level: LevelData) {
    const type = level.type || 0;
    this.levelColorIcon = `level-card__levelType--${LevelType[type]}`;
    this.levelTypeIcon = getLevelTypeIcon(type);
    this.levelTypeName = getLevelTypeName(type);
    this.levelData = level;
  }
  @Input() public isLastLevel = false;
  @Output() public levelStateChange = new EventEmitter<boolean>();
  @Output() public levelTypeChange = new EventEmitter<number>();
  public LevelType = LevelType;
  public LevelTypeSelector = [
    {
      type: 0,
      name: 'Неопределен',
      icon: 'fas fa-question',
    },
    {
      type: 1,
      name: 'Поиск',
      icon: 'fas fa-search',
    },
    {
      type: 2,
      name: 'Логика',
      icon: 'far fa-lightbulb',
    },
    {
      type: 3,
      name: 'Доезд',
      icon: 'fas fa-car',
    },
    {
      type: 4,
      name: 'Агентский',
      icon: 'far fa-user',
    },
    {
      type: 5,
      name: 'Заглушка',
      icon: 'far fa-clock',
    },
    {
      type: 6,
      name: 'Точка',
      icon: 'fas fa-map-pin',
    },
    {
      type: 7,
      name: 'Добег',
      icon: 'fas fa-walking',
    },
    {
      type: 8,
      name: 'Ралийка',
      icon: 'fas fa-road',
    },
    {
      type: 9,
      name: 'Лог.Поиск',
      icon: 'fas fa-user-graduate',
    },

    {
      type: 10,
      name: 'Ракеты',
      icon: 'fas fa-rocket',
    },
  ];
  public levelData?: LevelData;
  public levelColorIcon?: string;
  public levelTypeIcon?: string;
  public levelTypeName?: string;

  public selectLevelType(selectedType: number) {
    this.levelTypeChange.emit(selectedType);
  }

  public toggleLevelState() {
    if (!this.levelData) {
      return;
    }
    this.levelStateChange.emit(!this.levelData.removed);
  }
}
