import { PackageExecutorSchema, WebExtBuilderSchema } from './schema';
import * as webExt from 'web-ext';
import { ExecutorContext } from '@nx/devkit';

/**
 * Use web-ext to package your previously built web extension into a zip.
 * @param options - Raw options passed from the executor configuration.
 * @param context - Information about the project being packaged.
 * @returns An object indicating success or failure.
 */
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
