import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from './../../common/services/shared.service';

@Component({
  selector: 'team-card',
  templateUrl: 'team-card.component.html',
  styleUrls: ['team-card.component.scss']
})
export class TeamCardComponent implements OnInit {
  @Input() public teamInfo: QuestStat.TeamData;
  @Input() public removedLevel: boolean;
  public viewSettings: QuestStat.ViewSettings = {};

  constructor(private sharedService: SharedService) {}

  public ngOnInit() {
    this.sharedService.teamViewSettings.subscribe((settings) => {
      this.viewSettings = settings;
    });
  }
}
