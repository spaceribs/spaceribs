import { Tree, generateFiles, ProjectConfiguration } from '@nx/devkit';
import { resolve } from 'path';
import { getConfigDefaults } from './getConfigDefaults';

/**
 *
 * @param tree
 * @param root
 * @param projectType
 * @param name
 */
export const configureTypedoc = (
  tree: Tree,
  root: ProjectConfiguration['root'],
  projectType: ProjectConfiguration['projectType'],
  name: ProjectConfiguration['name'],
): void => {
  const templateSourceFolder = resolve(__dirname, '../../files');
  const substitutions = {
    options: getConfigDefaults(tree, projectType, root, name),
    tmpl: '',
  };
  generateFiles(tree, templateSourceFolder, root, substitutions);
};
