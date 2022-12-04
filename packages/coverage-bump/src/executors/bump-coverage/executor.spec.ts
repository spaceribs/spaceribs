import { BumpExecutorSchema } from './schema';
import executor from './executor';
import { ExecutorContext } from '@nrwl/devkit';

jest.mock('./command', () => ({
  createChildProcess: () => Promise.resolve(),
}));

describe('Bump Executor', () => {
  const options: BumpExecutorSchema = {};
  let context: ExecutorContext;

  beforeEach(() => {
    context = {
      root: '/root',
      isVerbose: false,
      workspace: {
        version: 2,
        npmScope: '*',
        projects: {
          'test-lib': {
            root: 'lib/test-lib',
          },
        },
      },
      cwd: '/root',
      projectName: 'test-lib',
    };
  });

  it('can only run if a test target is found.', async () => {
    await expect(executor(options, context)).rejects.toThrow(
      'No test target was found.'
    );
  });

  it('can only run if a test target matches jest.', async () => {
    context.workspace.projects['test-lib'].targets = {
      test: {
        executor: '@some/executor',
      },
    };
    await expect(executor(options, context)).rejects.toThrow(
      'Test target is not "@nrwl/jest:jest".'
    );
  });

  it('can only run if a jestConfig is specified.', async () => {
    context.workspace.projects['test-lib'].targets = {
      test: {
        executor: '@nrwl/jest:jest',
        options: {},
      },
    };
    await expect(executor(options, context)).rejects.toThrow(
      'No jest configuration was found.'
    );
  });

  it('can only run if a jestConfig has a coverageDirectory.', async () => {
    context.workspace.projects['test-lib'].targets = {
      test: {
        executor: '@nrwl/jest:jest',
        options: {
          jestConfig: 'libs/test-lib/jest.config.js',
        },
      },
    };

    await expect(executor(options, context)).rejects.toThrow(
      'Could not find coverageDirectory in jest configuration.'
    );
  });

  it('can run.', async () => {
    jest.mock(
      'libs/test-lib/jest.config.js',
      () => ({
        coverageDirectory: 'coverage/libs/test-lib',
      }),
      { virtual: true }
    );

    context.workspace.projects['test-lib'].targets = {
      test: {
        executor: '@nrwl/jest:jest',
        options: {
          jestConfig: 'libs/test-lib/jest.config.js',
        },
      },
    };

    const output = await executor(options, context);
    expect(output).toEqual({ success: true });
  });
});
