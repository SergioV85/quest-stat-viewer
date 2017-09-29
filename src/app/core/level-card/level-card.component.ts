import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from './../../common/services/util.service';
import { LevelType } from './../../common/services/level-type.enum';

@Component({
  selector: 'level-card',
  templateUrl: 'level-card.component.html',
  styleUrls: ['level-card.component.scss']
})
export class LevelCardComponent {
  @Input() public set levelInfo(level: QuestStat.LevelData) {
    this.levelColorIcon = `level-card__levelType--${LevelType[level.type]}`;
    this.levelTypeIcon = UtilService.getLevelTypeIcon(level.type);
    this.levelTypeName = UtilService.getLevelTypeName(level.type);
    this.levelData = level;
  };
  @Output() public levelStateChange = new EventEmitter<boolean>();
  @Output() public levelTypeChange = new EventEmitter<number>();
  public viewSettings: QuestStat.ViewSettings = {};
  public LevelType = LevelType;
  public LevelTypeSelector = [
    {
      type: 0,
      name: 'Неопределен',
      icon: 'fa-question'
    },
    {
      type: 1,
      name: 'Поиск',
      icon: 'fa-search'
    },
    {
      type: 2,
      name: 'Логика',
      icon: 'fa-lightbulb-o'
    },
    {
      type: 3,
      name: 'Доезд',
      icon: 'fa-car'
    },
    {
      type: 4,
      name: 'Агентский',
      icon: 'fa-user'
    },
    {
      type: 5,
      name: 'Заглушка',
      icon: 'fa-clock-o'
    },
  ];
  public levelData: QuestStat.LevelData;
  public levelColorIcon: string;
  public levelTypeIcon: string;
  public levelTypeName: string;

  public selectLevelType(selectedType) {
    this.levelTypeChange.emit(selectedType);
  }

  public toggleLevelState() {
    this.levelStateChange.emit(!this.levelData.removed);
  }
  public isOpenChange(): void {
    console.log('Dropdown state is changed');
  }
}
