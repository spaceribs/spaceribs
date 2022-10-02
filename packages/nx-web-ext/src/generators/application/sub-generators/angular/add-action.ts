import { Tree } from '@nrwl/devkit';
import { wrapAngularDevkitSchematic } from 'nx/src/adapter/ngcli-adapter';

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
