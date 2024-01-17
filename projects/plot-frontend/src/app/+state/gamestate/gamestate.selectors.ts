import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GAMESTATE_FEATURE_KEY, State } from './gamestate.reducer';

/**
 * Reduce the global state to gamestate.
 */
export const selectGameStateState = createFeatureSelector<State>(
  GAMESTATE_FEATURE_KEY,
);

/**
 * Reduce the gamestate state to loaded state.
 */
export const selectGameStateLoaded = createSelector(
  selectGameStateState,
  (state: State) => state.loaded,
);

/**
 * Reduce the gamestate state to error state.
 */
export const selectGameStateError = createSelector(
  selectGameStateState,
  (state: State) => state.error,
);

/**
 * Reduce the gamestate state to just the gamestate.
 */
export const selectGameState = createSelector(
  selectGameStateState,
  (state: State) => state.gamestate,
);
