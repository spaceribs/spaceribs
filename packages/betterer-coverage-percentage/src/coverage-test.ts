import type {
  BettererFileGlobs,
  BettererFilePatterns,
  BettererRun,
} from '@betterer/betterer';

import type {
  BettererCoverageDiff,
  BettererCoverageIssues,
  BettererCoverageTestFunction,
} from './types.js';

import { BettererConstraintResult } from '@betterer/constraints';
import { BettererTest, BettererDiff } from '@betterer/betterer';
import { deserialise, serialise } from './serialiser.js';
import { flatten } from './utils.js';

/**
 * @public `BettererCoverageTest` provides a wrapper around {@link @betterer/betterer#BettererTest | `BettererTest` }
 * that makes it easier to implement coverage tests.
 *
 * @remarks `BettererCoverageTest` provides a useful example for the more complex possibilities of the {@link @betterer/betterer#BettererTestOptions | `BettererTestOptions` }
 * interface.
 */
export class BettererCoverageTest extends BettererTest<
  BettererCoverageIssues,
  BettererCoverageIssues,
  BettererCoverageDiff
> {
  private _excluded: Array<RegExp> = [];
  private _included: Array<string> = [];

  /**
   * @internal This could change at any point! Please don't use!
   *
   * You should not construct a `BettererCoverageTest` directly.
   */
  constructor(
    test: BettererCoverageTestFunction,
    coverageSummaryPath = './coverage/coverage-summary.json',
    constraint: (
      result: BettererCoverageIssues,
      expected: BettererCoverageIssues,
    ) => BettererConstraintResult,
    differ: (
      expected: BettererCoverageIssues,
      result: BettererCoverageIssues,
    ) => BettererDiff<BettererCoverageIssues>,
    goal: (result: BettererCoverageIssues) => boolean,
  ) {
    super({
      test: (run: BettererRun) =>
        test(run, coverageSummaryPath, this._included, this._excluded),
      constraint,
      differ,
      goal,
      serialiser: {
        serialise,
        deserialise,
      },
    });
  }

  /**
   * Add a list of {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions | Regular Expression } filters for files to exclude when running the test.
   *
   * @param excludePatterns - RegExp filters to match file paths that should be excluded.
   * @returns This BettererCoverageTest, so it is chainable.
   */
  public exclude(...excludePatterns: BettererFilePatterns): this {
    if (!this._included.length) {
      this.include('**/*');
    }
    this._excluded = [...this._excluded, ...flatten(excludePatterns)];
    return this;
  }

  /**
   * Add a list of {@link https://www.npmjs.com/package/glob#user-content-glob-primer | glob }
   * patterns for files to include when running the test.
   *
   * @param includePatterns - Glob patterns to match file paths that should be included. All
   * `includes` should be relative to the {@link https://phenomnomnominal.github.io/betterer/docs/test-definition-file | test definition file}.
   * @returns This BettererCoverageTest, so it is chainable.
   */
  public include(...includePatterns: BettererFileGlobs): this {
    this._included = [...this._included, ...flatten(includePatterns)];
    return this;
  }
}
