import { Tree } from '@nx/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { ObjectLiteralExpression } from 'typescript';

/**
 * Ensure the application is configured to route by hash.
 * @param tree - The file tree to modify.
 * @param root - The root directory of the project.
 */
export const appRouterUseHash = (tree: Tree, root: string) => {
  const appModuleFilePath = `${root}/src/app/app.module.ts`;
  const appModule = tree.read(appModuleFilePath).toString();
  const newContents = tsquery.replace(
    appModule,
    'CallExpression:has(Identifier[name=RouterModule]) ArrayLiteralExpression ~ ObjectLiteralExpression',
    (node) => {
      console.log(node);
      const routerConfig = node as ObjectLiteralExpression;
      routerConfig.properties;
      if (routerConfig.properties) {
        return routerConfig.getText().replace('{', '{ useHash: true,');
      }
      return undefined;
    }
  );
  tree.write(appModuleFilePath, newContents);
};
