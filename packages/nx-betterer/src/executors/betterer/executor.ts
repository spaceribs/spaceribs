import { BettererExecutorSchema } from './schema';
import { betterer, BettererOptionsStart } from '@betterer/betterer';
import { ExecutorContext } from '@nrwl/devkit';
import * as path from 'path';

export default async function runExecutor(
  options: BettererExecutorSchema,
  context: ExecutorContext
) {
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

  await betterer(config);

  return {
    success: true,
  };
}
