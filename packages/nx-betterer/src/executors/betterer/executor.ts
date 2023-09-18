import { BettererExecutorSchema } from './schema';
import {
  betterer,
  watch,
  BettererOptionsWatch,
  BettererRunner,
  BettererOptionsStartCI,
  BettererOptionsStartUpdate,
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
  } else if (options.update === true) {
    const result = await betterer(updateConfig);
    if (
      (result.failed && result.failed.length > 0) ||
      (result.worse && result.worse.length > 0)
    ) {
      throw new Error(
        `Betterer failed for ${result.failed.length} tests and got worse for ${result.worse.length} tests.`,
      );
    }
  } else {
    const result = await betterer(ciConfig);
    console.log(result);
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
