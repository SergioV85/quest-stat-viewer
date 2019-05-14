import { gameDetailsReducer, initialState } from './game-details.reducer';

describe('GameDetails Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      // tslint:disable-next-line: no-any
      const action = {} as any;

      const result = gameDetailsReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
