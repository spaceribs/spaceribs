import { Tree } from '@nx/devkit';
import { componentGenerator } from '@nx/react';

/**
 * Add a browser action popup to the extension.
 * @param tree The file tree to modify.
 * @param project Name of the project to add the action module to.
 */
export const addAction = async (tree: Tree, project: string) => {
  await componentGenerator(tree, {
    project,
    name: 'action',
    routing: true,
    style: 'scss',
  });
};
