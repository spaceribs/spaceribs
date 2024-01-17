import * as GameStateActions from './gamestate.actions';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { GAMESTATE_FEATURE_KEY, reducer } from './gamestate.reducer';
import { Store, StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { GameState } from './gamestate.models';
import { GameStateEffects } from './gamestate.effects';
import { GameStateFacade } from './gamestate.facade';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

describe('GameStateFacade', () => {
  let facade: GameStateFacade;
  let store$: Store;
  let http: HttpTestingController;

  const createGameState = (): GameState => ({
    system: {
      time: '2024-01-13T20:30:50.167Z',
    },
    round: {
      end_time: '2024-01-13T23:30:50.167Z',
    },
    user: null,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(GAMESTATE_FEATURE_KEY, reducer),
          EffectsModule.forFeature([GameStateEffects]),
          HttpClientTestingModule,
        ],
        providers: [GameStateFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store$ = TestBed.inject<Store<object>>(Store);
      facade = TestBed.inject<GameStateFacade>(GameStateFacade);
      http = TestBed.inject(HttpTestingController);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return gamestate with loaded == true', async () => {
      let gamestate = await firstValueFrom(facade.gamestate$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(gamestate).toMatchSnapshot();
      expect(isLoaded).toBe(false);

      facade.init();

      http.expectOne('/gamestate/').flush([]);

      gamestate = await firstValueFrom(facade.gamestate$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(gamestate).toHaveLength(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadGameStateSuccess` to manually update list
     */
    it('should start allGameState$ return the gamestate; and loaded flag == true', async () => {
      let gamestate = await firstValueFrom(facade.gamestate$);
      let isLoaded = await firstValueFrom(facade.loaded$);

      expect(gamestate).toBeNull();
      expect(isLoaded).toBe(false);

      store$.dispatch(
        GameStateActions.loadGameStateSuccess({
          gamestate: createGameState(),
        }),
      );

      gamestate = await firstValueFrom(facade.gamestate$);
      isLoaded = await firstValueFrom(facade.loaded$);

      expect(gamestate).toMatchInlineSnapshot();
      expect(isLoaded).toBe(true);
    });

    it('should call refresh', () => {
      const actionSpy = jest.spyOn(GameStateActions, 'refresh');
      const spy = jest.spyOn(store$, 'dispatch');
      facade.refresh();

      expect(spy).toHaveBeenCalled();
      expect(actionSpy).toHaveBeenCalled();
    });
  });
});
