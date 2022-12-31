import { Hasher, HasherContext } from '@nrwl/devkit';

import { bettererHasher } from './hasher';

describe('bettererHasher', () => {
  it('should generate hash', async () => {
    const mockHasher: Hasher = {
      hashFile: jest.fn().mockReturnValue('test123'),
      hashTask: jest
        .fn()
        .mockReturnValue({ value: 'hashed-task', details: { test: 123 } }),
    } as unknown as Hasher;

    const hash = await bettererHasher(
      {
        projectRoot: 'root',
        id: 'my-task-id',
        target: {
          project: 'proj',
          target: 'target',
        },
        overrides: {},
      },
      {
        hasher: mockHasher,
        projectName: 'proj',
        workspace: {
          projects: {
            proj: {
              root: 'libs/proj',
            },
          },
        },
      } as unknown as HasherContext
    );
    expect(hash).toMatchSnapshot();
  });
});
