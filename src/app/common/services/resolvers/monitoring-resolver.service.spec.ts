import { TestBed, inject } from '@angular/core/testing';

import { GameMonitoringResolver } from './monitoring-resolver.service';

describe('MonitoringResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameMonitoringResolver]
    });
  });

  it('should be created', inject([GameMonitoringResolver], (service: GameMonitoringResolver) => {
    expect(service).toBeTruthy();
  }));
});
