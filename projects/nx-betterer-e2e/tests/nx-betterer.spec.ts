import {
  checkFilesExist,
  ensureNxProject,
  readFile,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';

describe('nx-betterer e2e', () => {
  let project: string;

  beforeAll(async () => {
    project = uniq('nx-betterer');
    ensureNxProject('@spaceribs/nx-betterer', 'dist/packages/nx-betterer');
    await runNxCommandAsync(
      `generate @nx/js:library ${project} --no-interactive`
    );
    await runNxCommandAsync(
      `generate @spaceribs/nx-betterer:add ${project} --no-interactive`
    );
  }, 30000);

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  describe('add generator', () => {
    it('should add a betterer configuration.', async () => {
      const projectJson = readJson(`libs/${project}/project.json`);
      expect(projectJson.targets.betterer).toEqual({
        executor: '@spaceribs/nx-betterer:betterer',
      });
      const bettererConfig = readFile(`libs/${project}/.betterer.ts`);
      expect(bettererConfig).toMatchInlineSnapshot(`
        "const typescript = require('@betterer/typescript');

        module.exports = {
          'stricter compilation': () =>
            typescript
              .typescript('./tsconfig.lib.json', {
                strict: true,
              })
              .include('./src/**/*.ts')
              .exclude(/\\\\.spec\\\\.ts/gi),
        };
        "
      `);
    }, 120000);
  });

  describe('betterer executor', () => {
    it('should run betterer.', async () => {
      const result = await runNxCommandAsync(`run ${project}:betterer`);
      expect(result.stdout).toContain(
        `"stricter compilation" has already met its goal!`
      );
    });
  });
});
