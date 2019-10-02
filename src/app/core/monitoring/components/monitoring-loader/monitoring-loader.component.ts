import { Component, Input } from '@angular/core';

@Component({
  selector: 'monitoring-loader',
  templateUrl: './monitoring-loader.component.html',
  styleUrls: ['./monitoring-loader.component.scss'],
})
export class MonitoringLoaderComponent {
  @Input()
  public parsingStat?: { pagesLeft: number; pageSaved: number; totalPages: number };
}
