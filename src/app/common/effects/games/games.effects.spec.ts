import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { GamesEffects } from './games.effects';

describe('GamesService', () => {
  let actions$: Observable<any>;
  let effects: GamesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GamesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(GamesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
