import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  addDependenciesToPackageJson,
  installPackagesTask,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import * as path from 'path';
import { AddGeneratorSchema } from './schema';

interface NormalizedSchema extends AddGeneratorSchema {
  projectName: string;
  projectRoot: string;
}
/**
 * Take the raw configuration and transform/decorate it for use.
 * @param tree The file tree to modify.
 * @param options Raw options passed from the generator.
 * @returns Normalized options used for generating files.
 */
function normalizeOptions(
  tree: Tree,
  options: AddGeneratorSchema
): NormalizedSchema {
  const name = names(options.projectName).fileName;
  const projectName = name.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${name}`;

  return {
    ...options,
    projectName,
    projectRoot,
  };
}

/**
 * Add .betterer.ts configuration file to project.
 * @param tree File tree to modify
 * @param options Options normalized by normalizeOptions()
 */
function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

/**
 * Generate and configure nx-betterer for use within the specified project
 * @param tree File tree to modify
 * @param options Raw options passed in from the generator configuration.
 */
export default async function (tree: Tree, options: AddGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfig = readProjectConfiguration(
    tree,
    normalizedOptions.projectName
  );

  if (projectConfig.targets) {
    projectConfig.targets.betterer = {
      executor: '@spaceribs/nx-betterer:betterer',
    };
  }

  updateProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfig
  );

  addDependenciesToPackageJson(
    tree,
    {},
    { '@betterer/betterer': '^5.4.0', '@betterer/typescript': '^5.4.0' }
  );

  installPackagesTask(tree);

  addFiles(tree, normalizedOptions);

  await formatFiles(tree);
}
