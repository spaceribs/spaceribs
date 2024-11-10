import { Tree, formatFiles } from '@nx/devkit';
import { TypedocGeneratorSchema } from './schema';
import {
  addDependencies,
  configureProject,
  configureTypedoc,
  configureGitIgnore,
} from './process';
import { getGeneratorExecutionParams } from './utils';

export default async function (
  tree: Tree,
  { project }: TypedocGeneratorSchema,
) {
  const { projectConfig, projectName, projectRoot, projectType, outputDir } =
    getGeneratorExecutionParams(tree, project);
  const installDependencies = addDependencies(tree);
  configureProject(tree, projectConfig, projectName, outputDir);
  configureTypedoc(tree, projectRoot, projectType, projectName);
  configureGitIgnore(tree, outputDir);
  await formatFiles(tree);
  return installDependencies;
}
