import { gamesReducer, initialState } from './games.reducer';

describe('Games Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      // tslint:disable-next-line: no-any
      const action = {} as any;

      const result = gamesReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});