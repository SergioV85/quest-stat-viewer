import { TestBed } from '@angular/core/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { State, GameInfo } from '@app-common/models';
import { mockedGames } from '@app-common/mocks/games.mock';
import { GAMES_LIST_ACTIONS } from '@app-core/games/actions/games.actions';
import { getGames } from '@app-core/games/reducers/games.reducer';
import { SavedGamesResolver } from './saved-games.resolver';

describe('SavedGamesResolver', () => {
  let resolver: SavedGamesResolver;
  let store$: MockStore<State>;
  let gamesList: MemoizedSelector<State, GameInfo[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), SavedGamesResolver],
    });
    store$ = TestBed.inject<Store<State>>(Store) as MockStore<State>;
    gamesList = store$.overrideSelector(getGames, []);
    spyOn(store$, 'dispatch');
    resolver = TestBed.inject<SavedGamesResolver>(SavedGamesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    const action = GAMES_LIST_ACTIONS.requestGames();

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
