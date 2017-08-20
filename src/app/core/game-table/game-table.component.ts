import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-table',
  templateUrl: 'game-table.component.html',
  styleUrls: ['game-table.component.scss']
})
export class GameTableComponent {
  @Input() public data: QuestStat.GameData;
  constructor() {}
}
