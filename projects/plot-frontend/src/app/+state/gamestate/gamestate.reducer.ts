import { createReducer, on, Action } from '@ngrx/store';

import * as GameStateActions from './gamestate.actions';
import { GameState } from './gamestate.models';

/**
 * The feature key for gamestate.
 */
export const GAMESTATE_FEATURE_KEY = 'gamestate';

/**
 * State of the gamestate feature.
 */
export interface State {
  gamestate: GameState | null;
  loaded: boolean;
  error?: unknown | null;
}

/**
 * State of gamestate combined with other global states.
 */
export interface GameStatePartialState {
  readonly [GAMESTATE_FEATURE_KEY]: State;
}

/**
 * Initial state of gamestate.
 */
export const initialState: State = {
  gamestate: null,
  loaded: false,
  error: null,
};

const gamestateReducer = createReducer(
  initialState,
  on(
    GameStateActions.init,
    (state): State => ({ ...state, loaded: false, error: null }),
  ),
  on(
    GameStateActions.refresh,
    (state): State => ({ ...state, loaded: false, error: null }),
  ),
  on(
    GameStateActions.loadGameStateSuccess,
    (state, { gamestate }): State => ({
      ...state,
      gamestate,
      loaded: true,
    }),
  ),
  on(
    GameStateActions.loadGameStateFailure,
    (state, { error }): State => ({ ...state, error, loaded: true }),
  ),
);

/**
 * Reduce state by action.
 *
 * @param {(State | undefined)} state State to reduce
 * @param {Action} action Action to reduce by
 * @returns {State} State reduced by action
 */
export const reducer = (state: State | undefined, action: Action): State =>
  gamestateReducer(state, action);
