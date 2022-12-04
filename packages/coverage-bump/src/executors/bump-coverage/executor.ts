import {
  ExecutorContext,
  logger,
  ProjectConfiguration,
  readJsonFile,
  runExecutor,
  writeJsonFile,
} from '@nrwl/devkit';
import { BumpCoverageExecutorSchema } from './schema';
import * as path from 'path';
import { readFileSync } from 'fs';

interface Coverage {
  total: number;
  covered: number;
  skipped: number;
  pct: 'Unknown' | number;
}

interface CoverageJsonSummary {
  total: {
    lines: Coverage;
    statements: Coverage;
    functions: Coverage;
    branches: Coverage;
    branchesTrue: Coverage;
  };
}

interface CoverageConfig {
  lines: number;
  statements: number;
  functions: number;
  branches: number;
}

export default async function bumpCoverageExecutor(
  options: BumpCoverageExecutorSchema,
  context: ExecutorContext
) {
  const projectName = context.projectName as string;
  const project = context.workspace.projects[projectName];
  const targets = project.targets;
  const testTarget = targets?.test;

  if (testTarget == null) {
    throw new Error('No test target was found.');
  }

  if (testTarget.executor !== '@nrwl/jest:jest') {
    throw new Error('Test target is not "@nrwl/jest:jest".');
  }

  const jestConfigPath = (testTarget.options as Record<string, unknown>)
    .jestConfig as string;

  if (jestConfigPath == null) {
    throw new Error('No jest configuration was found.');
  }

  if (jestConfigPath.endsWith('.json') !== true) {
    throw new Error('Only JSON is supported for bumping jest configurations.');
  }

  const testCoverage = await getTestCoverage(project, context);
  await writeCoverageToConfig(testCoverage, jestConfigPath);

  return {
    success: true,
  };
}

const getTestCoverage = async (
  project: ProjectConfiguration,
  context: ExecutorContext
): Promise<CoverageConfig> => {
  const coverageDirectory = `tmp/${project.root}`;
  const coverageDir = path.resolve(context.root, coverageDirectory);

  for await (const output of await runExecutor<{
    success: boolean;
  }>(
    { project: context.projectName, target: 'test' },
    {
      coverageReporters: 'json-summary',
      coverageDirectory,
      collectCoverage: true,
    },
    context
  )) {
    if (!output.success)
      throw new Error('Could not run tests or tests failed.');
  }

  const coveragePath = `${coverageDir}/coverage-summary.json`;
  const coverageFile = readFileSync(coveragePath).toString();
  const coverageSummary: CoverageJsonSummary = JSON.parse(coverageFile);

  return {
    lines:
      typeof coverageSummary.total.lines.pct !== 'number'
        ? 0
        : coverageSummary.total.lines.pct,
    statements:
      typeof coverageSummary.total.statements.pct !== 'number'
        ? 0
        : coverageSummary.total.statements.pct,
    functions:
      typeof coverageSummary.total.functions.pct !== 'number'
        ? 0
        : coverageSummary.total.functions.pct,
    branches:
      typeof coverageSummary.total.branches.pct !== 'number'
        ? 0
        : coverageSummary.total.branches.pct,
  };
};

const writeCoverageToConfig = async (
  newCoverage: CoverageConfig,
  jestConfigPath: string
) => {
  const jestConfig = readJsonFile(jestConfigPath);

  if (jestConfig.coverageThreshold?.global == null) {
    jestConfig.coverageThreshold = {
      global: {
        statements: 0,
        branches: 0,
        lines: 0,
        functions: 0,
      },
    };
  }

  let updated = false;

  ['statements', 'branches', 'lines', 'functions'].forEach((type) => {
    const oldCov = jestConfig.coverageThreshold.global[type];
    const newCov = newCoverage[type];
    if (oldCov < newCov) {
      jestConfig.coverageThreshold.global[type] = newCov;
      logger.info(`Updated ${type} coverage from ${oldCov}% to ${newCov}%`);
      updated = true;
    }
  });

  if (updated) {
    logger.info(`Writing coverage updates...`);
    writeJsonFile(jestConfigPath, jestConfig);
  } else {
    logger.info(`No updates required!`);
  }
};
