import {
  addDependenciesToPackageJson,
  installPackagesTask,
  Tree,
} from '@nx/devkit';

/**
 * Add web extension dependencies to the nx workspace.
 * @param tree - The file tree to modify.
 */
export const addWebExtDeps = async (tree: Tree) => {
  addDependenciesToPackageJson(
    tree,
    {
      'webextension-polyfill': 'latest',
    },
    {
      '@types/firefox-webext-browser': 'latest',
      '@types/webextension-polyfill': 'latest',
      'web-ext': '6.8.0',
      'web-ext-types': 'latest',
    },
  );
  installPackagesTask(tree);
};
