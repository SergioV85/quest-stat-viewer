import { Component, Input } from '@angular/core';

import { MonitoringTeamGroupedData } from '@app-common/models';

@Component({
  selector: 'monitoring-total',
  templateUrl: './monitoring-total.component.html',
  styleUrls: ['./monitoring-total.component.scss'],
})
export class MonitoringTotalComponent {
  @Input()
  public totalData: MonitoringTeamGroupedData[] = [];
  public pathToTeamName = ['_id', 'teamName'];
}
