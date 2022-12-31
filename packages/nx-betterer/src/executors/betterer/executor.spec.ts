jest.mock('@betterer/betterer');

import { BettererExecutorSchema } from './schema';
import executor from './executor';

const options: BettererExecutorSchema = {};

describe('Betterer Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {
      projectName: 'test',
      root: '',
      workspace: {
        version: 2,
        projects: {
          test: {
            root: 'apps/test',
          },
        },
      },
      cwd: '',
      isVerbose: false,
    });
    expect(output.success).toBe(true);
  });
});
