import { mergeRight } from 'ramda';
import { mockedMonitoringData } from '@app-common/mocks/monitoring.mock';
import { MonitoringState } from '@app-common/models';
import {
  CleanMonitoringDataAction,
  GetMonitoringDetailsAction,
  GetMonitoringDetailsFailedAction,
  GetMonitoringDetailsSuccessAction,
  RequestCodesAction,
  RequestCodesFailedAction,
  RequestCodesSuccessAction,
  RequestMonitoringAction,
  RequestMonitoringFailedAction,
  RequestMonitoringSuccessAction,
} from '@app-core/monitoring/actions/monitoring.actions';
import { monitoringReducer, initialState } from './monitoring.reducer';

const mutateState = mergeRight(initialState) as (data: Partial<MonitoringState>) => MonitoringState;

describe('Monitoring Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      // tslint:disable-next-line: no-any
      const action = {} as any;

      const result = monitoringReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
  describe('CleanMonitoringDataAction', () => {
    it('should return initial state', () => {
      const action = CleanMonitoringDataAction();
      const mutatedState = mutateState({
        dataLoaded: true,
        isLoading: false,
        pageSaved: 174,
        parsed: false,
        totalPages: 706,
        pagesLeft: 532,
        totalData: null,
      });
      const resultedState = monitoringReducer(mutatedState, action);
      expect(resultedState).toEqual(initialState);
    });
  });
  describe('GetMonitoringDetails', () => {
    describe('GetMonitoringDetailsAction', () => {
      it('should set loading flag to true', () => {
        const action = GetMonitoringDetailsAction({ playerId: 1, detailsLevel: 'byPlayer' });
        const expectedState = mutateState({
          isLoading: true,
        });
        const resultedState = monitoringReducer(initialState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('GetMonitoringDetailsFailedAction', () => {
      it('should set loading flag to false', () => {
        const action = GetMonitoringDetailsFailedAction({});
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
        });
        const resultedState = monitoringReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('GetMonitoringDetailsSuccessAction', () => {
      it('should set loading flag to false and store data to store', () => {
        const action = GetMonitoringDetailsSuccessAction({
          gameId: 45000,
          detailsLevel: 'byTeam',
          teamId: 12345,
          monitoringData: { parsed: true },
        });
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
          teamData: {
            12345: {
              parsed: true,
            },
          },
        });
        const resultedState = monitoringReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
  });
  describe('RequestCodes', () => {
    describe('RequestCodesAction', () => {
      it('should set loading flag to true', () => {
        const action = RequestCodesAction({ query: { levelId: 1, requestType: '' } });
        const expectedState = mutateState({
          isLoading: true,
        });
        const resultedState = monitoringReducer(initialState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('RequestCodesFailedAction', () => {
      it('should set loading flag to false', () => {
        const action = RequestCodesFailedAction({});
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
        });
        const resultedState = monitoringReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('RequestCodesSuccessAction', () => {
      it('should set loading flag to false and save codes to store', () => {
        const mockedCode = {
          GameId: 45000,
          code: 'test',
          isRemovedLevel: false,
          isSuccess: true,
          isTimeout: false,
          isDuplicate: false,
          level: 2,
          teamId: 13245,
          teamName: 'Jazz',
          time: '2019-08-01T20:00:00Z',
          timeDiff: 0,
          userId: 1,
          userName: 'SergioV',
          _id: 'some.generic.id',
        };
        const action = RequestCodesSuccessAction({
          gameId: 45000,
          levelId: 2,
          playerId: 1,
          requestType: 'byPlayer',
          codes: [mockedCode],
        });
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
          codes: {
            1: {
              2: [mockedCode],
            },
          },
        });
        const resultedState = monitoringReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
  });
  describe('RequestMonitoring', () => {
    describe('RequestMonitoringAction', () => {
      it('should set loading flag to true', () => {
        const action = RequestMonitoringAction({ id: 45000, domain: 'quest.ua' });
        const expectedState = mutateState({
          isLoading: true,
        });
        const resultedState = monitoringReducer(initialState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('RequestMonitoringFailedAction', () => {
      it('should set loading flag to false', () => {
        const action = RequestMonitoringFailedAction({});
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
        });
        const resultedState = monitoringReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('RequestMonitoringSuccessAction', () => {
      it('should set loading flag to false', () => {
        const action = RequestMonitoringSuccessAction({ data: mockedMonitoringData });
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
          dataLoaded: true,
          parsed: true,
          pagesLeft: 0,
          totalData: mockedMonitoringData.totalData,
        });
        const resultedState = monitoringReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
  });
});
