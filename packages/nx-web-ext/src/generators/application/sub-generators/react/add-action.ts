import { Tree } from '@nx/devkit';
import { componentGenerator } from '@nx/react';

export const addAction = async (tree: Tree, project: string) => {
  await componentGenerator(tree, {
    project,
    name: 'action',
    routing: true,
    style: 'scss',
  });
};
