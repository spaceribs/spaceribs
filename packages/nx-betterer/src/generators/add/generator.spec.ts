import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/web';

import generator from './generator';

describe('add generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await applicationGenerator(appTree, { name: 'test' });
    await generator(appTree, { projectName: 'test' });
    appTree.write('package.json', '{}');
  });

  it.skip('should run successfully', async () => {
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(config.targets?.betterer).toBeDefined();
  });
});
