import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'team-card',
  templateUrl: 'team-card.component.html',
  styleUrls: ['team-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  @Input() public additionsTime?: number;
  @Input() public bestTime?: boolean;
  @Input() public duration?: number;
  @Input() public levelTime?: number;
  @Input() public name?: string;
  @Input() public timeout?: boolean;
  @Input() public place?: number;
  @Input() public removedLevel?: boolean;
}
