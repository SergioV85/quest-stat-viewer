import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { NotificationEffects } from './notification.effects';

describe('NotificationService', () => {
  let actions$: Observable<any>;
  let effects: NotificationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(NotificationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
