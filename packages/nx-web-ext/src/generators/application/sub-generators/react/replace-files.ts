import { generateFiles, names, offsetFromRoot, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { NormalizedSchema } from '../../generator';

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
