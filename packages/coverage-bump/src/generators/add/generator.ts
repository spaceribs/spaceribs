import {
  formatFiles,
  getWorkspaceLayout,
  names,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { AddGeneratorSchema } from './schema';

interface NormalizedSchema extends AddGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: AddGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

export default async function (tree: Tree, options: AddGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfig = readProjectConfiguration(
    tree,
    normalizedOptions.projectName
  );

  projectConfig.targets = {
    'bump-coverage': {
      executor: '@spaceribs/coverage-bump:bump-coverage',
    },
  };

  updateProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfig
  );

  await formatFiles(tree);
}
