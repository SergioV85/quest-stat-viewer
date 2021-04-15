import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { hot, cold } from 'jasmine-marbles';

import { State } from '@app-common/models';
import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { mockedGameDetails } from '@app-common/mocks/games.mock';
import { ApiService } from '@app-common/services/api/api.service';
import { GAME_DETAILS_ACTIONS } from '@app-core/game-details/actions/game-details.actions';
import { getGameId, getGameDomain, getLevels } from '@app-core/game-details/reducers/game-details.reducer';
import { GameDetailsEffects } from './game-details.effects';

describe('Game Details: GameDetailsEffects', () => {
  let actions$: Observable<Actions>;
  let gameDetailsEffects: GameDetailsEffects;
  let store$: MockStore<State>;
  const apiService = {
    getGameStat: jasmine.createSpy('getGameStat'),
    saveLevelSettings: jasmine.createSpy('saveLevelSettings'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameDetailsEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: ApiService,
          useValue: apiService,
        },
      ],
    });
    store$ = TestBed.inject<Store<State>>(Store) as MockStore<State>;
    store$.overrideSelector(getGameId, 12345);
    store$.overrideSelector(getGameDomain, 'quest.ua');
    store$.overrideSelector(getLevels, []);
    gameDetailsEffects = TestBed.inject<GameDetailsEffects>(GameDetailsEffects);
    actions$ = TestBed.inject<Observable<Actions>>(Actions);
  });

  it('should be created', () => {
    expect(gameDetailsEffects).toBeTruthy();
  });
  describe('getGameDetails$', () => {
    const startAction = GAME_DETAILS_ACTIONS.requestGameDetails({ id: 12345, domain: 'quest.ua' });
    it('should send a request for getting game details and dispatch success action on complete', () => {
      const successAction = GAME_DETAILS_ACTIONS.requestGameDetailsSuccess({ data: mockedGameDetails });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedGameDetails });
      const expected$ = cold('--b', { b: successAction });

      apiService.getGameStat.and.returnValues(response$);
      expect(gameDetailsEffects.getGameDetails$).toBeObservable(expected$);
    });
    it('should send a request for getting games list but dispatch error action on fail', () => {
      const error = new Error('Error');
      const failAction = GAME_DETAILS_ACTIONS.requestGameDetailsFailed({});
      const messageAction = NOTIFICATION_ACTIONS.errorNotification({
        message: 'Извините, не удалось загрузить данные',
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getGameStat.and.returnValues(response$);
      expect(gameDetailsEffects.getGameDetails$).toBeObservable(expected$);
    });
  });
  describe('getGameDataFromEn$', () => {
    const startAction = GAME_DETAILS_ACTIONS.getLatestDataFromEn();
    it('should send a request for refreshing game data from EN ', () => {
      const successAction = GAME_DETAILS_ACTIONS.requestGameDetails({ domain: 'quest.ua', id: 12345, force: true });

      actions$ = hot('-a', { a: startAction });
      const expected$ = cold('-b', { b: successAction });

      expect(gameDetailsEffects.getGameDataFromEn$).toBeObservable(expected$);
    });
  });
  describe('saveLevels$', () => {
    const startAction = GAME_DETAILS_ACTIONS.saveLevelsTypes();
    it('should send a request for saving level data and dispatch success actions on complete', () => {
      const successAction = GAME_DETAILS_ACTIONS.saveLevelsTypesSuccess();
      const messageAction = NOTIFICATION_ACTIONS.successNotification({ message: 'Данные сохраненны' });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedGameDetails });
      const expected$ = cold('--(bc)', { b: successAction, c: messageAction });

      apiService.saveLevelSettings.and.returnValues(response$);
      expect(gameDetailsEffects.saveLevels$).toBeObservable(expected$);
    });
    it('should send a request for saving game data but dispatch error actions on fail', () => {
      const error = new Error('Error');
      const failAction = GAME_DETAILS_ACTIONS.saveLevelsTypesFailed({});
      const messageAction = NOTIFICATION_ACTIONS.errorNotification({
        message: 'Извините, не удалось сохранить данные',
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.saveLevelSettings.and.returnValues(response$);
      expect(gameDetailsEffects.saveLevels$).toBeObservable(expected$);
    });
  });
});
