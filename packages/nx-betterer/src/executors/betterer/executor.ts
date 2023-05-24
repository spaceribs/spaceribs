import { BettererExecutorSchema } from './schema';
import {
  betterer,
  watch,
  BettererOptionsStart,
  BettererOptionsWatch,
  BettererRunner,
} from '@betterer/betterer';
import { lastValueFrom, Observable } from 'rxjs';
import { ExecutorContext } from '@nx/devkit';
import * as path from 'path';

export default async function runExecutor(
  options: BettererExecutorSchema,
  context: ExecutorContext
) {
  if (context.projectName == null) {
    throw new Error('No project name specified.');
  }

  const project = context.workspace.projects[context.projectName];
  const projectRoot = path.resolve(context.root, project.root);

  const config: BettererOptionsStart = {
    ci: options.ci,
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    cache: true,
    cachePath: path.resolve(
      context.root,
      'tmp',
      project.root,
      '.betterer.cache'
    ),
  };

  const watchConfig: BettererOptionsWatch = {
    watch: true,
    cwd: projectRoot,
    tsconfigPath: './tsconfig.json',
    cache: true,
    cachePath: path.resolve(
      context.root,
      'tmp',
      project.root,
      '.betterer.cache'
    ),
  };

  if (options.watch !== true) {
    await betterer(config);
  } else {
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
  }

  return {
    success: true,
  };
}
