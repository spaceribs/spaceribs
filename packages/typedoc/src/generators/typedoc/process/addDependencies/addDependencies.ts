import {
  addDependenciesToPackageJson,
  Tree,
  GeneratorCallback,
} from '@nx/devkit';
import { peerDependencies } from '../../../../../package.json';

/**
 *
 * @param tree
 */
export const addDependencies = (tree: Tree): GeneratorCallback => {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = peerDependencies;
  return addDependenciesToPackageJson(tree, dependencies, devDependencies);
};
