import { Tree } from '@nrwl/devkit';
import { componentGenerator } from '@nrwl/react';

export const addAction = async (tree: Tree, project: string) => {
  await componentGenerator(tree, {
    project,
    name: 'action',
    routing: true,
    style: 'scss',
  });
};
