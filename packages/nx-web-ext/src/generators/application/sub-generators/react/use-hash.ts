import { Tree } from '@nx/devkit';

/**
 * Switch to using hash based routing.
 * @param tree - The file tree to modify.
 * @param root - The root directory of the project.
 */
export const appRouterUseHash = (tree: Tree, root: string) => {
  const mainFilePath = `${root}/src/main.tsx`;
  const main = tree.read(mainFilePath).toString();
  const newContents = main.replace(
    new RegExp('BrowserRouter', 'g'),
    'HashRouter'
  );
  tree.write(mainFilePath, newContents);
};
