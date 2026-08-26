import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nx/devkit';
import { toArguments } from './process';
import { spawn } from 'child_process';
import { delimiter, join } from 'path';

/**
 *
 * @param options
 * @param context
 */
export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext,
) {
  const config = context.projectsConfigurations.projects[context.projectName];
  const args = toArguments(options);

  // typedoc runs from the project directory so its relative options resolve, but
  // a package manager's `exec` only looks at the nearest package.json and cannot
  // find a workspace-root binary from there. Put that bin directory on PATH and
  // call typedoc directly instead.
  const processOpts = {
    cwd: config.root || context.root,
    shell: true,
    env: {
      ...process.env,
      PATH: [join(context.root, 'node_modules', '.bin'), process.env.PATH]
        .filter(Boolean)
        .join(delimiter),
    },
  };
  return new Promise<{
    success: boolean;
  }>((resolve) => {
    const childProcess = spawn('typedoc', args, processOpts);
    process.on('exit', () => childProcess.kill());
    process.on('SIGTERM', () => childProcess.kill());
    childProcess.stdout.on('data', (data) => console.info(data.toString()));
    childProcess.stderr.on('data', (data) => console.error(data.toString()));
    childProcess.on('close', (code) => resolve({ success: code === 0 }));
  });
}
