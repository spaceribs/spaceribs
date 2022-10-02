import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import generator from './generator';
import { NxWebExtGeneratorSchema } from './schema';

jest.mock('./sub-generators/angular');

import { angularApp } from './sub-generators/angular';

describe('nx-web-ext generator', () => {
  let appTree: Tree;
  const options: NxWebExtGeneratorSchema = {
    name: 'test',
    framework: 'angular',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    expect(angularApp).toHaveBeenCalled();
  });
});
