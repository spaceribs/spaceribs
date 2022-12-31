import { BettererExecutorSchema } from './schema';
import executor from './executor';

const options: BettererExecutorSchema = {};

describe('Betterer Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {
      root: '',
      workspace: undefined,
      cwd: '',
      isVerbose: false,
    });
    expect(output.success).toBe(true);
  });
});
