import {
  formatFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  generateFiles,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import * as path from 'path';
import { AssetLibraryGeneratorSchema } from './schema';

interface NormalizedSchema extends AssetLibraryGeneratorSchema {
  projectRoot: string;
}

/**
 * Take the raw configuration and transform/decorate it for use.
 * @param tree - The file tree to modify.
 * @param options - Raw options passed from the generator.
 * @returns Normalized options used for generating files.
 */
function normalizeOptions(
  tree: Tree,
  options: AssetLibraryGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;

  return {
    ...options,
    projectRoot,
    name,
    buildable: true,
    linter: 'eslint',
    bundler: 'none',
    unitTestRunner: 'none',
    js: false,
  };
}

/**
 * Add and replace source files for asset library compilation
 * @param tree - File tree to modify
 * @param options - Options normalized by normalizeOptions()
 */
function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
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

/**
 * Replace the "build" task with one that uses @spaceribs/nx-threejs:build
 * @param tree - File tree to modify
 * @param options - Options normalized by normalizeOptions()
 */
function updateBuildTarget(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.name);

  projectConfig.targets['compile'] = {
    executor: '@spaceribs/nx-threejs:build',
    outputs: ['{options.outFolder}'],
    options: {
      objFolder: `${options.projectRoot}/src/obj`,
      glbFolder: `${options.projectRoot}/src/glb`,
      gltfFolder: `${options.projectRoot}/src/gltf`,
    },
  };

  projectConfig.targets.build.options.assets = [
    `${options.projectRoot}/*.md`,
    `${options.projectRoot}/src/glb/*.glb`,
    `${options.projectRoot}/src/gltf/*.gltf`,
  ];

  projectConfig.targets.build.dependsOn = ['compile'];

  updateProjectConfiguration(tree, options.name, projectConfig);
}

/**
 * Generator for creating a publishable three.js asset library
 * @param tree - File tree to modify
 * @param options - Options normalized by normalizeOptions()
 */
export default async function (
  tree: Tree,
  options: AssetLibraryGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  await libraryGenerator(tree, normalizedOptions);
  addFiles(tree, normalizedOptions);
  updateBuildTarget(tree, normalizedOptions);
  await formatFiles(tree);
}
