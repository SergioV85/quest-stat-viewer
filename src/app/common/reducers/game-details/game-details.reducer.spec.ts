import { gameDetailsReducer, initialState } from './game-details.reducer';

describe('GameDetails Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any;

      const result = gameDetailsReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
