import {
  Tree,
  readProjectConfiguration,
  ProjectConfiguration,
} from '@nx/devkit';
import { TypedocGeneratorSchema } from '../../schema';

/**
 *
 * @param tree
 * @param project
 */
export const getProjectConfig = (
  tree: Tree,
  project: TypedocGeneratorSchema['project'],
): ProjectConfiguration => readProjectConfiguration(tree, project);
