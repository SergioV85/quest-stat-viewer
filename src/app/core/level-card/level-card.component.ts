import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { SharedService } from './../../common/services/shared.service';
import { LevelType } from './../../common/services/level-type.enum';

@Component({
  selector: 'level-card',
  templateUrl: 'level-card.component.html',
  styleUrls: ['level-card.component.scss']
})
export class LevelCardComponent implements OnInit {
  @Input() public levelInfo: QuestStat.LevelData;
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

  constructor(private sharedService: SharedService) {}

  public ngOnInit() {
    this.sharedService.teamViewSettings.subscribe((settings) => {
      this.viewSettings = settings;
    });
  }

  public get levelColorIcon(): string {
    return `level-card__levelType--${LevelType[this.levelInfo.type]}`;
  }

  public get levelTypeIcon(): string {
    let icon = '';
    switch (this.levelInfo.type) {
      case LevelType.Search:
        icon = 'fa-search';
        break;
      case LevelType.Logic:
        icon = 'fa-lightbulb-o';
        break;
      case LevelType.Drive:
        icon = 'fa-car';
        break;
      case LevelType.Agent:
        icon = 'fa-user';
        break;
      case LevelType.Waiting:
        icon = 'fa-clock-o';
        break;
      case LevelType.General:
      default:
        icon = 'fa-question';
        break;
    }
    return icon;
  }

  public get levelTypeName(): string {
    let name = '';
    switch (this.levelInfo.type) {
      case LevelType.Search:
        name = 'Поиск';
        break;
      case LevelType.Logic:
        name = 'Логика';
        break;
      case LevelType.Drive:
        name = 'Доезд';
        break;
      case LevelType.Agent:
        name = 'Агентский';
        break;
      case LevelType.Waiting:
        name = 'Заглушка';
        break;
      case LevelType.General:
      default:
        name = 'Неопределен';
        break;
    }
    return name;
  }

  public selectLevelType(selectedType) {
    this.levelTypeChange.emit(selectedType);
  }

  public toggleLevelState() {
    this.levelStateChange.emit(!this.levelInfo.removed);
  }
}
