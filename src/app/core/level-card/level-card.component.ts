import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { SharedService } from './../../common/services/shared.service';
import { UtilService } from './../../common/services/util.service';
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
    return UtilService.getLevelTypeIcon(this.levelInfo.type);
  }

  public get levelTypeName(): string {
    return UtilService.getLevelTypeName(this.levelInfo.type);
  }

  public selectLevelType(selectedType) {
    this.levelTypeChange.emit(selectedType);
  }

  public toggleLevelState() {
    this.levelStateChange.emit(!this.levelInfo.removed);
  }
}
