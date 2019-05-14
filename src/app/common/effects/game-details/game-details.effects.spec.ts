import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GameDetailsEffects } from './game-details.effects';

xdescribe('GameDetailsService', () => {
  // tslint:disable-next-line: no-any prefer-const
  let actions$: Observable<any>;
  let effects: GameDetailsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameDetailsEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.get(GameDetailsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
