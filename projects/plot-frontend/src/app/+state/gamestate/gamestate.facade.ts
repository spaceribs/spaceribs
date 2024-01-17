import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as GameStateActions from './gamestate.actions';
import * as GameStateSelectors from './gamestate.selectors';

/**
 * Facade for all calls to and from the gamestate endpoints.
 */
@Injectable()
export class GameStateFacade {
  loaded$ = this.store$.select(GameStateSelectors.selectGameStateLoaded);
  gamestate$ = this.store$.select(GameStateSelectors.selectGameState);

  constructor(private readonly store$: Store) {}

  public init() {
    this.store$.dispatch(GameStateActions.init());
  }

  public refresh() {
    this.store$.dispatch(GameStateActions.refresh());
  }
}
