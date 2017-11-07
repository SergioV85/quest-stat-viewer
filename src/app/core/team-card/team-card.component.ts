import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SharedService } from './../../common/services/shared.service';

@Component({
  selector: 'team-card',
  templateUrl: 'team-card.component.html',
  styleUrls: ['team-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamCardComponent implements OnInit {
  @Input() public additionsTime: number;
  @Input() public bestTime: boolean;
  @Input() public duration: number;
  @Input() public levelTime: number;
  @Input() public name: string;
  @Input() public timeout: boolean;
  @Input() public place: number;
  @Input() public removedLevel: boolean;
  public viewSettings: QuestStat.ViewSettings = {};

  constructor(private sharedService: SharedService) {}

  public ngOnInit() {
    this.sharedService.teamViewSettings.subscribe((settings) => {
      this.viewSettings = settings;
    });
  }
}
