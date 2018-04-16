import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { MonitoringEffects } from './monitoring.effects';

describe('MonitoringService', () => {
  let actions$: Observable<any>;
  let effects: MonitoringEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitoringEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(MonitoringEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
