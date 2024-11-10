import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';

export const getProjectConfiguration = (
  context: ExecutorContext,
): ProjectConfiguration => context.workspace.projects[context.projectName];
