import { GameState } from './gamestate.models';
import { GameStatePartialState, initialState } from './gamestate.reducer';
import * as GameStateSelectors from './gamestate.selectors';

describe('GameState Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const selectSystemTime = (it: GameState) => it.system.time;
  const createGameState = (): GameState => ({
    system: {
      time: '2024-01-13T20:30:50.167Z',
    },
    round: {
      end_time: '2024-01-13T23:30:50.167Z',
    },
    user: null,
  });

  let state: GameStatePartialState;

  beforeEach(() => {
    state = {
      gamestate: {
        ...initialState,
        gamestate: createGameState(),
        error: ERROR_MSG,
        loaded: true,
      },
    };
  });

  describe('GameState Selectors', () => {
    it('getAllGameState() should return the gamestate.', () => {
      const results = GameStateSelectors.selectGameState(state) as GameState;
      const selTime = selectSystemTime(results);

      expect(results).toMatchSnapshot();
      expect(selTime).toBe('2024-01-13T20:30:50.167Z');
    });

    it('getGameStateLoaded() should return the current "loaded" status.', () => {
      const result = GameStateSelectors.selectGameStateLoaded(state);

      expect(result).toBe(true);
    });

    it('getGameStateError() should return the current "error" state.', () => {
      const result = GameStateSelectors.selectGameStateError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
