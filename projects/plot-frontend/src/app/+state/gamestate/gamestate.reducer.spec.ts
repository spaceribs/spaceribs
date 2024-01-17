import { Action } from '@ngrx/store';

import * as GameStateActions from './gamestate.actions';
import { GameState } from './gamestate.models';
import { State, initialState, reducer } from './gamestate.reducer';

describe('GameState Reducer', () => {
  const createGameState = (): GameState => ({
    system: {
      time: '2024-01-13T20:30:50.167Z',
    },
    round: {
      end_time: '2024-01-13T23:30:50.167Z',
    },
    user: null,
  });

  describe('valid GameState actions', () => {
    it('loadGameStateSuccess should return the list of known GameState', () => {
      const gamestate = createGameState();
      const action = GameStateActions.loadGameStateSuccess({ gamestate });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.gamestate).toMatchSnapshot();
    });

    it('loadGameStateFailure should return an error', () => {
      const error = new Error('we failed');
      const action = GameStateActions.loadGameStateFailure({ error });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.error).toBe(error);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
