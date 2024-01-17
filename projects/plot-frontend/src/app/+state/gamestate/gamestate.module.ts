import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromGameState from './gamestate.reducer';
import { GameStateEffects } from './/gamestate.effects';
import { GameStateFacade } from './/gamestate.facade';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromGameState.GAMESTATE_FEATURE_KEY,
      fromGameState.reducer,
    ),
    EffectsModule.forFeature([GameStateEffects]),
  ],
  providers: [GameStateFacade],
})
export class GameStateModule {}
