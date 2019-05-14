import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GamesEffects } from './games.effects';

xdescribe('GamesService', () => {
  // tslint:disable-next-line: no-any prefer-const
  let actions$: Observable<any>;
  let effects: GamesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamesEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(GamesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
