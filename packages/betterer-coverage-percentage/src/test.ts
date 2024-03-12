import type { BettererRun } from '@betterer/betterer';

import type {
  BettererCoverageIssue,
  BettererCoverageIssues,
  IstanbulCoverage,
  IstanbulCoverageSummary,
  IstanbulFileCoverage,
} from './types.js';

import { BettererError } from '@betterer/errors';
import { promises as fs } from 'node:fs';
const { path } = require('node:path');

import { isNumber } from './utils.js';

export async function percentageTest(
  run: BettererRun,
  relativeCoverageSummaryPath: string,
): Promise<BettererCoverageIssues> {
  const baseDirectory = getTestBaseDirectory(run);
  const absoluteCoverageSummaryPath = path.resolve(
    baseDirectory,
    relativeCoverageSummaryPath,
  );
  const { total } = await readCoverageSummary(absoluteCoverageSummaryPath);
  return {
    total: getCoveredPercentages(total),
  };
}

async function readCoverageSummary(
  coverageSummaryPath: string,
): Promise<IstanbulCoverageSummary> {
  const result = await loadCoverageFile(coverageSummaryPath);
  if (result) {
    return result;
  } else {
    throw new BettererError(`Could not read coverage summary`);
  }
}

async function loadCoverageFile(
  coverageSummaryPath: string,
): Promise<IstanbulCoverageSummary | null> {
  try {
    const coverageReport = await fs.readFile(coverageSummaryPath, 'utf-8');
    return decodeCoverageSummary(JSON.parse(coverageReport));
  } catch (e) {
    return null;
  }
}

function decodeCoverageSummary(
  data: IstanbulCoverageSummary | unknown,
): IstanbulCoverageSummary | null {
  if (isIstanbulSummary(data) && data['total'] != null) {
    return data;
  }
  return null;
}

function isIstanbulSummary(data: unknown): data is IstanbulCoverageSummary {
  const maybeSummary = data as IstanbulCoverageSummary;
  return (
    maybeSummary &&
    Object.keys(maybeSummary).every((key) => isFileCoverage(maybeSummary[key]))
  );
}

function isFileCoverage(data: unknown): data is IstanbulFileCoverage {
  const maybeCoverage = data as IstanbulFileCoverage;
  return (
    maybeCoverage &&
    isCoverage(maybeCoverage.branches) &&
    isCoverage(maybeCoverage.functions) &&
    isCoverage(maybeCoverage.lines) &&
    isCoverage(maybeCoverage.statements)
  );
}

function isCoverage(data: unknown): data is IstanbulCoverage {
  const maybeData = data as IstanbulCoverage;
  return (
    maybeData &&
    isNumber(maybeData.covered) &&
    isNumber(maybeData.pct) &&
    isNumber(maybeData.skipped) &&
    isNumber(maybeData.total)
  );
}
function getCoveredPercentages(
  fileCoverage: IstanbulFileCoverage,
): BettererCoverageIssue {
  return {
    lines: fileCoverage.lines.pct,
    statements: fileCoverage.statements.pct,
    functions: fileCoverage.functions.pct,
    branches: fileCoverage.branches.pct,
  };
}

function getTestBaseDirectory(run: BettererRun): string {
  return path.dirname((run as BettererRunΩ).test.configPath);
}

type BettererRunΩ = BettererRun & {
  test: {
    configPath: string;
  };
};
