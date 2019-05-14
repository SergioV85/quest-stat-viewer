import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { MonitoringEffects } from './monitoring.effects';

xdescribe('MonitoringService', () => {
  // tslint:disable-next-line: no-any prefer-const
  let actions$: Observable<any>;
  let effects: MonitoringEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonitoringEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(MonitoringEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
