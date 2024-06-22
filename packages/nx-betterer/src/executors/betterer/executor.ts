import {
  BettererOptionsStart,
  BettererOptionsWatch,
  BettererRunner,
  BettererSuiteSummary,
  betterer,
  watch,
} from '@betterer/betterer';
import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';
import { Observable, firstValueFrom } from 'rxjs';
import { BettererExecutorSchema } from './schema';

const checkFail = (result: BettererSuiteSummary) => {
  if (
    (result.failed && result.failed.length > 0) ||
    (result.worse && result.worse.length > 0)
  ) {
    throw new Error(
      `Betterer failed for ${result.failed.length} tests and got worse for ${result.worse.length} tests.`,
    );
  }
};

/**
 * Use nx-betterer to measure previously defined code standards
 * @param options - Raw options passed from the executor configuration.
 * @param context - Information about the project being assessed.
 * @returns An object indicating success or failure.
 */
export default async (
  options: BettererExecutorSchema,
  context: ExecutorContext,
) => {
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

  const defaultConfig: BettererOptionsStart = {
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    cache: true,
    cachePath,
    strict: true,
    update: false,
    watch: false,
  };

  const forceUpdateConfig: BettererOptionsStart = {
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    update: true,
    cache: false,
  };

  const watchConfig: BettererOptionsWatch = {
    watch: true,
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    cache: true,
    cachePath,
  };

  if (options.watch === true) {
    const bettererWatch$ = new Observable((observe) => {
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
          void runner.stop(true);
        }
      };
    });

    await firstValueFrom(bettererWatch$);
  } else if (options.forceUpdate === true) {
    await betterer(forceUpdateConfig);
  } else {
    const result = await betterer(defaultConfig);
    checkFail(result);
  }

  return {
    success: true,
  };
};
