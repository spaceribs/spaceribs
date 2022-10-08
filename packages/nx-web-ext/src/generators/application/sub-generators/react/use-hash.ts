import { Tree } from '@nrwl/devkit';

export const appRouterUseHash = (tree: Tree, root: string) => {
  const mainFilePath = `${root}/src/main.tsx`;
  const main = tree.read(mainFilePath).toString();
  const newContents = main.replace(
    new RegExp('BrowserRouter', 'g'),
    'HashRouter'
  );
  tree.write(mainFilePath, newContents);
};
