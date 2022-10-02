import {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import type { NxWebExtGeneratorSchema } from './schema';
import { angularApp } from './sub-generators/angular';

export interface NormalizedSchema extends NxWebExtGeneratorSchema {
  projectName: string;
  description: string;
}

function normalizeOptions(options: NxWebExtGeneratorSchema): NormalizedSchema {
  const projectName = names(options.name).fileName;

  return {
    ...options,
    description: options.description || '',
    projectName,
  };
}

export const addFiles = (
  tree: Tree,
  options: NormalizedSchema,
  root: string
) => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(root),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), root, templateOptions);
};

export default async function (tree: Tree, options: NxWebExtGeneratorSchema) {
  const normalizedOptions = normalizeOptions(options);

  switch (normalizedOptions.framework) {
    case 'angular':
      await angularApp(tree, normalizedOptions);
      break;
    default:
      throw new Error('This application target is not supported.');
      break;
  }

  await formatFiles(tree);
}
