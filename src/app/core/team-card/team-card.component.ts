import { Component, Input } from '@angular/core';

@Component({
  selector: 'team-card',
  templateUrl: 'team-card.component.html',
  styleUrls: ['team-card.component.scss']
})
export class TeamCardComponent {
  @Input() public teamInfo: QuestStat.TeamData;

  constructor() {}
}