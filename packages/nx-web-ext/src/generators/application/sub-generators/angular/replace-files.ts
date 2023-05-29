import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../../generator';

/**
 * Replace certain files to support an Angular based web extension.
 * @param tree The file tree to modify.
 * @param options Options normalized by normalizeOptions()
 * @param root The root directory of the project.
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

  tree.delete('src/app/app.routes.ts');
};
