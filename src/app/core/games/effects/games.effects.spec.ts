import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';

import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { mockedGames } from '@app-common/mocks/games.mock';
import { ApiService } from '@app-common/services/api/api.service';
import { GAMES_LIST_ACTIONS } from '@app-core/games/actions/games.actions';
import { GamesEffects } from './games.effects';

describe('GamesEffects', () => {
  let actions$: Observable<Actions>;
  let gamesEffects: GamesEffects;
  const apiService = {
    getSavedGames: jasmine.createSpy('getSavedGames'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamesEffects, provideMockActions(() => actions$), { provide: ApiService, useValue: apiService }],
    });

    gamesEffects = TestBed.inject<GamesEffects>(GamesEffects);
    actions$ = TestBed.inject<Observable<Actions>>(Actions);
  });

  it('should be created', () => {
    expect(gamesEffects).toBeTruthy();
  });
  describe('getGames$', () => {
    const startAction = GAMES_LIST_ACTIONS.requestGames();
    it('should send a request for getting games list and dispatch success action on complete', () => {
      const successAction = GAMES_LIST_ACTIONS.requestGamesSuccess({ data: mockedGames });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedGames });
      const expected$ = cold('--b', { b: successAction });

      apiService.getSavedGames.and.returnValues(response$);
      expect(gamesEffects.getGames$).toBeObservable(expected$);
    });
    it('should send a request for getting games list but dispatch error action on fail', () => {
      const error = new Error('Error');
      const failAction = GAMES_LIST_ACTIONS.requestGamesFailed({});
      const messageAction = NOTIFICATION_ACTIONS.errorNotification({
        message: 'Извините, не удалось загрузить данные',
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getSavedGames.and.returnValues(response$);
      expect(gamesEffects.getGames$).toBeObservable(expected$);
    });
  });
});
