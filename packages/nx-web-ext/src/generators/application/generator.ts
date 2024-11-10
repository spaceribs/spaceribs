import {
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import type { NxWebExtGeneratorSchema } from './schema';

export interface NormalizedSchema extends NxWebExtGeneratorSchema {
  /**
   * The name of the new project.
   */
  name: string;
  /**
   * The name of the new project.
   */
  path: string;
  /**
   * The description of the new web extension.
   */
  description: string;
}

/**
 * Take the raw configuration and transform/decorate it for use.
 * @param options - Raw options passed from the generator.
 * @returns Normalized options used for generating files.
 */
function normalizeOptions(options: NxWebExtGeneratorSchema): NormalizedSchema {
  const projectName = names(options.name).fileName;

  return {
    ...options,
    description: options.description || '',
    name: projectName,
    path: options.path,
  };
}

/**
 * Add and replace files to support a web extension project.
 * @param tree - The file tree to modify.
 * @param options - Options normalized by normalizeOptions()
 * @param root - The root directory of the project.
 */
export const addFiles = (
  tree: Tree,
  options: NormalizedSchema,
  root: string,
) => {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(root),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), root, templateOptions);
};

/**
 * Generator used to create a web extension.
 * @param tree - The file tree the generator is modifying.
 * @param options - The raw options passed by the generator.
 */
export default async function (tree: Tree, options: NxWebExtGeneratorSchema) {
  const normalizedOptions = normalizeOptions(options);

  switch (normalizedOptions.framework) {
    case 'angular': {
      const { angularApp } = await import('./sub-generators/angular');
      await angularApp(tree, normalizedOptions);
      break;
    }
    case 'react': {
      const { reactApp } = await import('./sub-generators/react');
      await reactApp(tree, normalizedOptions);
      break;
    }
    default:
      throw new Error('This application target is not supported.');
  }

  await formatFiles(tree);
}
