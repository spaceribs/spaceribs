import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { addAction } from './add-action';
import { appRouterUseHash } from './use-hash';

import { applicationGenerator } from '@nx/react';
import { addFiles, NormalizedSchema } from '../../generator';
import { Linter } from '@nx/linter';
import { replaceFiles } from './replace-files';
import { resolve } from 'path';

export const reactApp = async (tree: Tree, options: NormalizedSchema) => {
  await applicationGenerator(tree, {
    name: options.name,
    routing: true,
    e2eTestRunner: 'none',
    style: 'scss',
    skipFormat: false,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
  });

  const config = readProjectConfiguration(tree, options.name);

  appRouterUseHash(tree, config.root);

  await addAction(tree, options.name);

  const manifestPath = `${config.root}/src/manifest.json`;
  if (config.targets.build.options.assets.includes(manifestPath) != true) {
    config.targets.build.options.assets.push(
      `${config.root}/src/manifest.json`
    );
  }

  config.targets.serve.executor = '@spaceribs/nx-web-ext:serve';

  const buildPath = config.targets.build.options.outputPath;
  config.targets.package = {
    executor: '@spaceribs/nx-web-ext:package',
    dependsOn: ['build'],
    options: {
      sourceDir: config.targets.build.options.outputPath,
      artifactsDir: resolve(buildPath, '..'),
    },
  };

  addFiles(tree, options, config.root);

  replaceFiles(tree, options, config.root);

  updateProjectConfiguration(tree, config.name, config);
};
