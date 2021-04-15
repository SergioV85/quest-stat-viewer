import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { hot, cold } from 'jasmine-marbles';

import { State } from '@app-common/models';
import { NOTIFICATION_ACTIONS } from '@app-common/actions/notification.actions';
import { mockedMonitoringData, mockedMonitoringDetailsData, mockedCodesList } from '@app-common/mocks/monitoring.mock';
import { ApiService } from '@app-common/services/api/api.service';
import { MONITORING_ACTIONS } from '@app-core/monitoring/actions/monitoring.actions';
import { getGameId } from '@app-core/game-details/reducers/game-details.reducer';

import { MonitoringEffects } from './monitoring.effects';

describe('Monitoring: MonitoringEffects', () => {
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
    store$ = TestBed.inject<Store<State>>(Store) as MockStore<State>;
    store$.overrideSelector(getGameId, 12345);
    monitoringEffects = TestBed.inject<MonitoringEffects>(MonitoringEffects);
    actions$ = TestBed.inject<Observable<Actions>>(Actions);
  });

  it('should be created', () => {
    expect(monitoringEffects).toBeTruthy();
  });
  describe('getMonitoring$', () => {
    const startAction = MONITORING_ACTIONS.requestMonitoring({ id: 12345, domain: 'quest.ua' });
    it('should send a request for getting grouped game monitoring data and dispatch success action on complete', () => {
      const successAction = MONITORING_ACTIONS.requestMonitoringSuccess({ data: mockedMonitoringData });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-a|', { a: mockedMonitoringData });
      const expected$ = cold('--b', { b: successAction });

      apiService.getMonitoringData.and.returnValues(response$);
      expect(monitoringEffects.getMonitoring$).toBeObservable(expected$);
    });
    it('should send a request for getting grouped game monitoring data but dispatch error action on fail', () => {
      const error = new Error('Error');
      const failAction = MONITORING_ACTIONS.requestMonitoringFailed({});
      const messageAction = NOTIFICATION_ACTIONS.errorNotification({
        message: 'Извините, не удалось загрузить данные',
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getMonitoringData.and.returnValues(response$);
      expect(monitoringEffects.getMonitoring$).toBeObservable(expected$);
    });
  });
  describe('getMonitoringDetails$', () => {
    const startAction = MONITORING_ACTIONS.getMonitoringDetails({ teamId: 13977, detailsLevel: 'byTeam' });
    it('should send a request for getting detailed monitoring data and dispatch success action on complete', () => {
      const successAction = MONITORING_ACTIONS.getMonitoringDetailsSuccess({
        gameId: 12345,
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
      const failAction = MONITORING_ACTIONS.getMonitoringDetailsFailed({});
      const messageAction = NOTIFICATION_ACTIONS.errorNotification({
        message: 'Извините, не удалось загрузить данные',
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getMonitoringDetails.and.returnValues(response$);
      expect(monitoringEffects.getMonitoringDetails$).toBeObservable(expected$);
    });
  });
  describe('getCodesList$', () => {
    const startAction = MONITORING_ACTIONS.requestCodes({
      query: { playerId: 52015, levelId: 5, requestType: 'byPlayer' },
    });
    it('should send a request for getting codes list and dispatch success action on complete', () => {
      const successAction = MONITORING_ACTIONS.requestCodesSuccess({
        gameId: 12345,
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
      const failAction = MONITORING_ACTIONS.requestCodesFailed({});
      const messageAction = NOTIFICATION_ACTIONS.errorNotification({
        message: 'Извините, не удалось загрузить данные',
      });

      actions$ = hot('-a', { a: startAction });
      const response$ = cold('-#|', {}, error);
      const expected$ = cold('--(bc)', { b: failAction, c: messageAction });

      apiService.getListOfCodes.and.returnValues(response$);
      expect(monitoringEffects.getCodesList$).toBeObservable(expected$);
    });
  });
});
