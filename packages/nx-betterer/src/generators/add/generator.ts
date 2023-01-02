import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  addDependenciesToPackageJson,
  installPackagesTask,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  runExecutor,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import * as path from 'path';
import { AddGeneratorSchema } from './schema';

interface NormalizedSchema extends AddGeneratorSchema {
  projectName: string;
  projectRoot: string;
}

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
