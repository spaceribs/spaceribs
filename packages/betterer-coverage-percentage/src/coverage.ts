import { BettererCoverageTest } from './coverage-test.js';
import { percentageTest } from './test.js';

import { percentageConstraint } from './constraint.js';
import { percentageDiffer } from './differ.js';
import { percentageGoal } from './goal.js';

/**
 * @public
 * Use this test to track your total test coverage. Reads a {@link https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-reports/lib/json-summary/index.js | json-summary format}
 * coverage summary. Make sure to run your tests separately before running Betterer.
 *
 * @param coverageSummaryPath - relative path to the coverage summary. Defaults to './coverage/coverage-summary.json'.
 * @param constraint - a function to decide whether results have improved or not.
 * Defaults to reporting an improvement if every coverage metric is at least the same, and at least one coverage
 * percentage is higher; a deterioration is reported when at least a single percentage decreases.
 * @param differ - a function for generating a diff to be included in the test output. Defaults to a function
 * that returns the percentage differences.
 * @param goal - a function that checks if the metric goal has been attained. Defaults to a function that aims toward a
 * goal of 100% coverage for every metric.
 */
export function coveragePercentage(
  coverageSummaryPath?: string,
  constraint = percentageConstraint,
  differ = percentageDiffer,
  goal = percentageGoal,
): BettererCoverageTest {
  return new BettererCoverageTest(
    percentageTest,
    coverageSummaryPath,
    constraint,
    differ,
    goal,
  );
}
