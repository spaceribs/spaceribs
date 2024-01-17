import { createAction, props } from '@ngrx/store';
import { GameState } from './gamestate.models';

/**
 * Action to initialize gamestate.
 */
export const init = createAction('[GameState] Init');

/**
 * Action taken when successfully loading gamestate.
 */
export const loadGameStateSuccess = createAction(
  '[GameState/App] Load GameState Success',
  props<{ gamestate: GameState }>(),
);

/**
 * Action taken when failing to load gamestate.
 */
export const loadGameStateFailure = createAction(
  '[GameState/App] Load GameState Failure',
  props<{ error: unknown }>(),
);

/**
 * Action taken when refreshing the gamestate.
 */
export const refresh = createAction('[GameState/App] Refresh');
