import { BettererExecutorSchema } from './schema';
import {
  betterer,
  watch,
  BettererOptionsWatch,
  BettererRunner,
  BettererOptionsStartCI,
  BettererOptionsStartUpdate,
  BettererOptionsStartPrecommit,
} from '@betterer/betterer';
import { lastValueFrom, Observable } from 'rxjs';
import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';

/**
 * Use nx-betterer to measure previously defined code standards
 * @param options - Raw options passed from the executor configuration.
 * @param context - Information about the project being assessed.
 * @returns An object indicating success or failure.
 */
export default async function runExecutor(
  options: BettererExecutorSchema,
  context: ExecutorContext,
) {
  if (context.projectName == null) {
    throw new Error('No project name specified.');
  }

  const project = context.workspace.projects[context.projectName];
  const projectRoot = path.resolve(context.root, project.root);
  const cachePath = path.resolve(
    context.root,
    'tmp',
    project.root,
    '.betterer.cache',
  );

  const ciConfig: BettererOptionsStartCI = {
    ci: true,
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    cache: true,
    cachePath,
  };

  const updateConfig: BettererOptionsStartUpdate = {
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    update: true,
    cachePath,
  };

  const watchConfig: BettererOptionsWatch = {
    watch: true,
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    cache: true,
    cachePath,
  };

  const precommitConfig: BettererOptionsStartPrecommit = {
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    precommit: true,
    cachePath,
  };

  if (options.watch === true) {
    const bettererWatch = new Observable((observe) => {
      let runner: BettererRunner;

      watch(watchConfig)
        .then((watchRunner) => {
          runner = watchRunner;
          observe.next(runner);
        })
        .catch((err) => {
          observe.error(err);
        });

      return () => {
        if (runner != null) {
          runner.stop(true);
        }
      };
    });

    await lastValueFrom(bettererWatch);
  } else if (options.precommit === true) {
    await betterer(precommitConfig);
  } else if (options.update === true) {
    await betterer(updateConfig);
  } else {
    const result = await betterer(ciConfig);
    if (result.changed.length) {
      throw new Error(
        `Betterer failed due to ${result.changed.join(
          ', ',
        )} not being up to date, please run precommit`,
      );
    }
    const anyNew = result.runSummaries.find((summary) => summary.isComplete);
    if (anyNew != null && anyNew.isComplete !== true) {
      throw new Error(
        `Betterer failed due to ${anyNew.name} not being complete, please run update.`,
      );
    }
    if (
      (result.failed && result.failed.length > 0) ||
      (result.worse && result.worse.length > 0)
    ) {
      throw new Error(
        `Betterer failed for ${result.failed.length} tests and got worse for ${result.worse.length} tests.`,
      );
    }
  }

  return {
    success: true,
  };
}
