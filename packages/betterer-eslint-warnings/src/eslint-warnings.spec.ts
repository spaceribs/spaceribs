import { eslintWarnings } from './eslint-warnings';

describe('WangTileWorld', () => {
  it('should be able to be initialized.', () => {
    const bettererPlugin = eslintWarnings();
    expect(bettererPlugin).toBeDefined();
  });
});
