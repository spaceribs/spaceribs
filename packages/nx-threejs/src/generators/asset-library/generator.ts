import {
  formatFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  generateFiles,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/js';
import * as path from 'path';
import { AssetLibraryGeneratorSchema } from './schema';

interface NormalizedSchema extends AssetLibraryGeneratorSchema {
  projectRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: AssetLibraryGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  // const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  // const parsedTags = options.tags
  //   ? options.tags.split(',').map((s) => s.trim())
  //   : [];

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
