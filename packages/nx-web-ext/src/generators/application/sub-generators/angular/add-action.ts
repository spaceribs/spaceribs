import { Tree } from '@nx/devkit';
import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';

/**
 * Add a browser action popup to the extension.
 * @param tree The file tree to modify.
 * @param project Name of the project to add the action module to.
 */
export const addAction = async (tree: Tree, project: string) => {
  const moduleGenerator = wrapAngularDevkitSchematic(
    '@schematics/angular',
    'module'
  );

  await moduleGenerator(tree, {
    project,
    name: 'action',
    route: 'action',
    module: 'app',
    routing: true,
  });
};
