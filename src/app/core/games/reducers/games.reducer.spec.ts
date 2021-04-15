import { mergeRight } from 'ramda';
import { GamesState } from '@app-common/models';
import { mockedGames } from '@app-common/mocks/games.mock';
import { GAMES_LIST_ACTIONS } from '@app-core/games/actions/games.actions';
import { gamesReducer, initialState } from './games.reducer';

const mutateState = mergeRight(initialState) as (data: Partial<GamesState>) => GamesState;

describe('Games Reducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const action = {} as any;

      const result = gamesReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
  describe('RequestGamesAction', () => {
    describe('RequestGamesAction', () => {
      it('should set loading flag to true', () => {
        const action = GAMES_LIST_ACTIONS.requestGames();
        const expectedState = mutateState({
          isLoading: true,
        });
        const resultedState = gamesReducer(initialState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('RequestGamesFailedAction', () => {
      it('should set loading flag to false', () => {
        const action = GAMES_LIST_ACTIONS.requestGamesFailed({});
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
        });
        const resultedState = gamesReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
    describe('RequestGamesSuccessAction', () => {
      it('should set loading flag to false and store data to store', () => {
        const action = GAMES_LIST_ACTIONS.requestGamesSuccess({
          data: mockedGames,
        });
        const mutatedState = mutateState({
          isLoading: true,
        });
        const expectedState = mutateState({
          isLoading: false,
          games: mockedGames,
        });
        const resultedState = gamesReducer(mutatedState, action);
        expect(expectedState).toEqual(resultedState);
      });
    });
  });
});
