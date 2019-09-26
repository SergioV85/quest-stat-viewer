import { TestBed } from '@angular/core/testing';

import { GameDataResolver } from './game-details.resolver';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('GameDataResolver', () => {
  let resolver: GameDataResolver;
  let store$: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore, GameDataResolver],
    });
    store$ = TestBed.get<Store<State>>(Store);
    resolver = TestBed.get<GameDataResolver>(GameDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
