import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';

/**
 *
 * @param context
 */
export const getProjectConfiguration = (
  context: ExecutorContext,
): ProjectConfiguration =>
  context.projectsConfigurations.projects[context.projectName];
