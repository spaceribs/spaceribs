import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { fetch } from '@nrwl/angular';
import { map } from 'rxjs/operators';

import * as GameStateActions from './gamestate.actions';
import { GameState } from './gamestate.models';

/**
 * Observable effects associated with the gamestate feature.
 */
@Injectable()
export class GameStateEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameStateActions.init, GameStateActions.refresh),
      fetch({
        run: () =>
          this.http
            .get<GameState>('/gamestate/')
            .pipe(
              map((res) =>
                GameStateActions.loadGameStateSuccess({ gamestate: res }),
              ),
            ),
        onError: (_, error: unknown) => {
          this.errorHandler.handleError(error);
          return GameStateActions.loadGameStateFailure({ error });
        },
      }),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly errorHandler: ErrorHandler,
    private readonly http: HttpClient,
  ) {}
}
