import type { BettererCoverageIssues } from './types.js';

export function percentageGoal(result: BettererCoverageIssues): boolean {
  return Object.keys(result).every((filePath) => {
    const { lines, statements, functions, branches } = result[filePath];
    return (
      lines === 100 &&
      statements === 100 &&
      functions === 100 &&
      branches === 100
    );
  });
}
