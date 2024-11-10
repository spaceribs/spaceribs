import { Tree } from '@nx/devkit';
import { componentGenerator } from '@nx/react';

/**
 * Add a browser action popup to the extension.
 * @param tree - The file tree to modify.
 * @param path - Path of the project to add the action module to.
 */
export const addAction = async (tree: Tree, path: string) => {
  await componentGenerator(tree, {
    path,
    name: 'action',
    routing: true,
    style: 'scss',
  });
};
