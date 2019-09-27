import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { hot, cold } from 'jasmine-marbles';

import { State } from '@app-common/models';
import { ApiService } from '@app-common/services/api/api.service';
import {
  RequestMonitoringAction,
  RequestMonitoringSuccessAction,
  RequestMonitoringFailedAction,
  GetMonitoringDetailsAction,
  GetMonitoringDetailsSuccessAction,
  GetMonitoringDetailsFailedAction,
  RequestCodesSuccessAction,
  RequestCodesAction,
  RequestCodesFailedAction,
} from '@app-common/actions/monitoring.actions';
import { ErrorNotificationAction } from '@app-common/actions/notification.actions';
import { getGameId } from '@app-common/reducers/game-details/game-details.reducer';

import { MonitoringEffects } from './monitoring.effects';

describe('MonitoringEffects', () => {
  let actions$: Observable<Actions>;
  let monitoringEffects: MonitoringEffects;
  let store$: MockStore<State>;
  const apiService = {
    getMonitoringData: jasmine.createSpy('getMonitoringData'),
    getMonitoringDetails: jasmine.createSpy('getMonitoringDetails'),
    getListOfCodes: jasmine.createSpy('getListOfCodes'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitoringEffects,
        provideMockStore(),
        provideMockActions(() => actions$),
        {
          provide: ApiService,
          useValue: apiService,
        },
      ],
    });
    store$ = TestBed.get<Store<State>>(Store);
    store$.overrideSelector(getGameId, 12345);
    monitoringEffects = TestBed.get<MonitoringEffects>(MonitoringEffects);
    actions$ = TestBed.get<Actions>(Actions);
  });

  it('should be created', () => {
    expect(monitoringEffects).toBeTruthy();
  });
  describe('getMonitoring$', () => {
    const startAction = RequestMonitoringAction({ id: 12345, domain: 'quest.ua' });
    it('should send a request for getting grouped game monitoring data and dispatch success action on complete', () => {
      const successAction = RequestMonitoringSuccessAction({ data: mockedMonitoringData });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedMonitoringData });
      const expected$ = cold('--b', { b: successAction });

      apiService.getMonitoringData.and.returnValues(response$);
      expect(monitoringEffects.getMonitoring$).toBeObservable(expected$);
    });
    it('should send a request for getting grouped game monitoring data but dispatch error action on fail', () => {
      const error = new Error('Error');
      const failAction = RequestMonitoringFailedAction({});
      const messageAction = ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getMonitoringData.and.returnValues(response$);
      expect(monitoringEffects.getMonitoring$).toBeObservable(expected$);
    });
  });
  describe('getMonitoringDetails$', () => {
    const startAction = GetMonitoringDetailsAction({ teamId: 13977, detailsLevel: 'byTeam' });
    it('should send a request for getting detailed monitoring data and dispatch success action on complete', () => {
      const successAction = GetMonitoringDetailsSuccessAction({
        teamId: 13977,
        detailsLevel: 'byTeam',
        monitoringData: mockedMonitoringDetailsData,
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedMonitoringDetailsData });
      const expected$ = cold('--b', { b: successAction });

      apiService.getMonitoringDetails.and.returnValues(response$);
      expect(monitoringEffects.getMonitoringDetails$).toBeObservable(expected$);
    });
    it('should send a request for getting detailed monitoring data but dispatch error action on fail', () => {
      const error = new Error('Error');
      const failAction = GetMonitoringDetailsFailedAction({});
      const messageAction = ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getMonitoringDetails.and.returnValues(response$);
      expect(monitoringEffects.getMonitoringDetails$).toBeObservable(expected$);
    });
  });
  describe('getCodesList$', () => {
    const startAction = RequestCodesAction({ query: { playerId: 52015, levelId: 5, type: 'byPlayer' } });
    it('should send a request for getting codes list and dispatch success action on complete', () => {
      const successAction = RequestCodesSuccessAction({
        playerId: 52015,
        levelId: 5,
        requestType: 'byPlayer',
        codes: mockedCodesList,
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedCodesList });
      const expected$ = cold('--b', { b: successAction });

      apiService.getListOfCodes.and.returnValues(response$);
      expect(monitoringEffects.getCodesList$).toBeObservable(expected$);
    });
    it('should send a request for getting codes list but dispatch error action on fail', () => {
      const error = new Error('Error');
      const failAction = RequestCodesFailedAction({});
      const messageAction = ErrorNotificationAction({ message: 'Извините, не удалось загрузить данные' });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getListOfCodes.and.returnValues(response$);
      expect(monitoringEffects.getCodesList$).toBeObservable(expected$);
    });
  });
});
