import { TestBed } from '@angular/core/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { State, TeamData } from '@app-common/models';
import { mockedGameDetails } from '@app-common/mocks/games.mock';
import { RequestGameDetailsAction } from '@app-core/game-details/actions/game-details.actions';
import { getFinishResults } from '@app-core/game-details/reducers/game-details.reducer';
import { GameDataResolver } from './game-details.resolver';

describe('GameDataResolver', () => {
  let resolver: GameDataResolver;
  let store$: MockStore<State>;
  let gameDetails: MemoizedSelector<State, TeamData[] | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore, GameDataResolver],
    });
    store$ = TestBed.get<Store<State>>(Store);
    gameDetails = store$.overrideSelector(getFinishResults, null);
    spyOn(store$, 'dispatch');
    resolver = TestBed.get<GameDataResolver>(GameDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    // tslint:disable-next-line: no-any
    const mockActivatedRouteSnapshot: any = {
      params: {
        domain: 'quest.ua',
        id: '12345',
      },
    };
    const action = RequestGameDetailsAction({ domain: 'quest.ua', id: 12345 });

    it('should resolve the game details', () => {
      resolver.resolve(mockActivatedRouteSnapshot).subscribe();
      expect(store$.dispatch).toHaveBeenCalledWith(action);
    });
    it('should not call action for game details if it already exist', () => {
      gameDetails.setResult(mockedGameDetails.stat.FinishResults);
      resolver.resolve(mockActivatedRouteSnapshot).subscribe();
      expect(store$.dispatch).not.toHaveBeenCalledWith(action);
    });
  });
});
