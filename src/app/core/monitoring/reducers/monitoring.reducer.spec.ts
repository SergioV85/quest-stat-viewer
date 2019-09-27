import { monitoringReducer, initialState } from './monitoring.reducer';

describe('Monitoring Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      // tslint:disable-next-line: no-any
      const action = {} as any;

      const result = monitoringReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
