import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromGamestate from './+state/gamestate/gamestate.reducer';
import { GameStateEffects } from './+state/gamestate/gamestate.effects';
import { GameStateFacade } from './+state/gamestate/gamestate.facade';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(GameStateEffects),
    provideState(fromGamestate.GAMESTATE_FEATURE_KEY, fromGamestate.reducer),
    GameStateFacade,
    provideStore(),
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(),
  ],
};
