import {
  formatFiles,
  names,
  readProjectConfiguration,
  TargetConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { AddGeneratorSchema } from './schema';
import { addPropertyToJestConfig } from '@nrwl/jest';

interface NormalizedSchema extends AddGeneratorSchema {
  projectName: string;
}

function normalizeOptions(
  tree: Tree,
  options: AddGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;

  const projectName = name;

  return {
    ...options,
    projectName,
  };
}

export default async function (tree: Tree, options: AddGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfig = readProjectConfiguration(
    tree,
    normalizedOptions.projectName
  );

  projectConfig.targets['bump-coverage'] = {
    executor: '@spaceribs/coverage-bump:bump-coverage',
  };

  if (projectConfig.targets.test == null) {
    throw new Error('Test target is not available.');
  }

  const testTarget: TargetConfiguration = projectConfig.targets.test;

  addPropertyToJestConfig(
    tree,
    testTarget.options.jestConfig,
    'collectCoverage',
    true
  );

  addPropertyToJestConfig(
    tree,
    testTarget.options.jestConfig,
    'coverageReporters',
    ['json', 'text']
  );

  addPropertyToJestConfig(
    tree,
    testTarget.options.jestConfig,
    'coverageThreshold',
    {
      global: {
        branches: 0,
        functions: 0,
        lines: 0,
        statements: 0,
      },
    }
  );

  updateProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfig
  );

  await formatFiles(tree);
}
