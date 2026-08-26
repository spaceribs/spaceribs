import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { addAction } from './add-action';
import { appRouterUseHash } from './use-hash';

import { applicationGenerator } from '@nx/react';
import { addFiles, NormalizedSchema } from '../../generator';
import { Linter } from '@nx/eslint';
import { replaceFiles } from './replace-files';
import { resolve } from 'path';

/**
 * Generate a react application.
 * @param tree - The file tree to modify.
 * @param options - Options normalized by normalizeOptions()
 */
export const reactApp = async (tree: Tree, options: NormalizedSchema) => {
  await applicationGenerator(tree, {
    directory: options.path,
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

  const { targets } = config;

  if (targets?.build?.options == null || targets.serve == null) {
    throw new Error(
      `The generated "${options.name}" application has no build or serve target.`,
    );
  }

  // TargetConfiguration types its options as `any`; name the two fields used here.
  const buildOptions = targets.build.options as {
    assets: string[];
    outputPath: string;
  };

  const manifestPath = `${config.root}/src/manifest.json`;
  if (buildOptions.assets.includes(manifestPath) != true) {
    buildOptions.assets.push(manifestPath);
  }

  targets.serve.executor = '@spaceribs/nx-web-ext:serve';

  targets.package = {
    executor: '@spaceribs/nx-web-ext:package',
    dependsOn: ['build'],
    options: {
      sourceDir: buildOptions.outputPath,
      artifactsDir: resolve(buildOptions.outputPath, '..'),
    },
  };

  addFiles(tree, options, config.root);

  replaceFiles(tree, options, config.root);

  updateProjectConfiguration(tree, options.name, config);
};
