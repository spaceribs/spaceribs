import { PackageExecutorSchema, WebExtBuilderSchema } from './schema';
import * as webExt from 'web-ext';
import { ExecutorContext } from '@nrwl/devkit';

export default async function runExecutor(
  options: PackageExecutorSchema,
  context: ExecutorContext
) {
  if (context.projectName == null) {
    throw new Error('no project name set.');
  }

  const webExtOptions: WebExtBuilderSchema = {
    ...options,
    overwriteDest: true,
  };

  await webExt.cmd.build(webExtOptions);

  return {
    success: true,
  };
}
