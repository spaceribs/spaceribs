import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import generator from './generator';
import { NxWebExtGeneratorSchema } from './schema';

jest.mock('./sub-generators/angular', () => ({
  angularApp: jest.fn(),
}));
jest.mock('./sub-generators/react', () => ({
  reactApp: jest.fn(),
}));

import { angularApp } from './sub-generators/angular';
import { reactApp } from './sub-generators/react';

describe('nx-web-ext generator', () => {
  let appTree: Tree;
  const options: NxWebExtGeneratorSchema = {
    name: 'test',
    framework: 'angular',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should build an angular app successfully.', async () => {
    await generator(appTree, options);
    expect(angularApp).toHaveBeenCalled();
  });

  it('should build a react app successfully.', async () => {
    options.framework = 'react';
    await generator(appTree, options);
    expect(reactApp).toHaveBeenCalled();
  });

  it('should error if no framework matches.', async () => {
    options.framework = 'boop' as any;
    await expect(generator(appTree, options)).rejects.toMatchInlineSnapshot(
      `[Error: This application target is not supported.]`
    );
  });
});
