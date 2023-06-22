import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../../generator';

/**
 * Replace
 * @param tree - The file tree to modify.
 * @param options - Raw options passed from the generator.
 * @param root - The root directory of the project.
 */
export const replaceFiles = (
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
