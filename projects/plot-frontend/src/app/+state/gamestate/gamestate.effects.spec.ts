import * as GameStateActions from './gamestate.actions';

import { Observable, of, throwError } from 'rxjs';

import { Action } from '@ngrx/store';
import { ErrorHandler } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GameStateEffects } from './gamestate.effects';
import { TestBed } from '@angular/core/testing';
import { hot } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

describe('GameStateEffects', () => {
  let actions$: Observable<Action>;
  let effects: GameStateEffects;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GameStateEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: ErrorHandler,
          useValue: {
            handleError: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(GameStateEffects);
    http = TestBed.inject(HttpClient);
  });

  describe('init$', () => {
    it('should work', () => {
      jest.spyOn(http, 'get').mockReturnValue(
        of({
          system: {
            time: '2024-01-13T20:30:50.167Z',
          },
          round: {
            end_time: '2024-01-13T23:30:50.167Z',
          },
          user: null,
        }),
      );
      actions$ = hot('-a-|', { a: GameStateActions.init() });

      const expected$ = hot('-a-|', {
        a: GameStateActions.loadGameStateSuccess({
          gamestate: {
            system: {
              time: '2024-01-13T20:30:50.167Z',
            },
            round: {
              end_time: '2024-01-13T23:30:50.167Z',
            },
            user: null,
          },
        }),
      });

      expect(effects.init$).toBeObservable(expected$);
    });

    it('should return error', () => {
      jest.spyOn(http, 'get').mockReturnValue(throwError(new Error()));

      actions$ = hot('-a-|', { a: GameStateActions.init() });

      const expected$ = hot('-a-|', {
        a: GameStateActions.loadGameStateFailure({ error: new Error() }),
      });

      expect(effects.init$).toBeObservable(expected$);
    });
  });
});
