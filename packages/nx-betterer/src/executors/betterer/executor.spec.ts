jest.mock('@betterer/betterer');

import { BettererExecutorSchema } from './schema';
import executor from './executor';
import { BettererSuiteSummary, betterer } from '@betterer/betterer';

const options: BettererExecutorSchema = {};

describe('Betterer Executor', () => {
  const mockBetterer = betterer as jest.MockedFunction<typeof betterer>;
  it('can run', async () => {
    const summary: BettererSuiteSummary = {
      runSummaries: [],
      changed: [],
      better: [],
      completed: [],
      expired: [],
      failed: [],
      new: [],
      ran: [],
      same: [],
      skipped: [],
      updated: [],
      worse: [],
      filePaths: [],
      runs: [],
    };
    mockBetterer.mockResolvedValue(summary);
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
    expect(mockBetterer).toHaveBeenCalled();
    expect(output.success).toBe(true);
  });
});
