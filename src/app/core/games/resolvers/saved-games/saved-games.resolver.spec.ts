import { TestBed } from '@angular/core/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { State, GameInfo } from '@app-common/models';
import { mockedGames } from '@app-common/mocks/games.mock';
import { RequestGamesAction } from '@app-core/games/actions/games.actions';
import { getGames } from '@app-core/games/reducers/games.reducer';
import { SavedGamesResolver } from './saved-games.resolver';

describe('SavedGamesResolver', () => {
  let resolver: SavedGamesResolver;
  let store$: MockStore<State>;
  let gamesList: MemoizedSelector<State, GameInfo[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore, SavedGamesResolver],
    });
    store$ = TestBed.get<Store<State>>(Store);
    gamesList = store$.overrideSelector(getGames, []);
    spyOn(store$, 'dispatch');
    resolver = TestBed.get<SavedGamesResolver>(SavedGamesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    const action = RequestGamesAction();

    it('should resolve the games list', () => {
      resolver.resolve().subscribe();
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
    it('should not call action for games list if it already exist', () => {
      gamesList.setResult(mockedGames);
      resolver.resolve().subscribe();
      expect(store$.dispatch).not.toHaveBeenCalledWith(action);
    });
  });
});
