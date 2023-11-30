import { ensureNxProject, runNxCommandAsync, uniq } from '@nx/plugin/testing';

describe('nx-web-ext e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@spaceribs/nx-web-ext', 'dist/packages/nx-web-ext');
  });

  afterAll(async () => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    await runNxCommandAsync('reset');
  });

  describe('--framework', () => {
    describe('angular', () => {
      let project: string;

      beforeEach(async () => {
        project = uniq('nx-web-ext-angular');
        await runNxCommandAsync(
          `generate @spaceribs/nx-web-ext:application ${project} --framework="angular" --no-interactive`,
        );
      });

      it.skip('should create a web extension project and build successfully', async () => {
        const result = await runNxCommandAsync(`build ${project}`);
        expect(result.stdout).toContain('Successfully ran target build');
      }, 120000);

      it.skip('should create a web extension project and package successfully', async () => {
        const result = await runNxCommandAsync(`package ${project}`);
        expect(result.stdout).toContain('Your web extension is ready');
      }, 120000);
    });

    describe.skip('react', () => {
      let project: string;

      beforeEach(async () => {
        project = uniq('nx-web-ext-react');
        await runNxCommandAsync(
          `generate @spaceribs/nx-web-ext:application ${project} --framework="react" --no-interactive`,
        );
      });

      it('should create a web extension project and build successfully', async () => {
        const result = await runNxCommandAsync(`build ${project}`);
        expect(result.stdout).toContain('Successfully ran target build');
      }, 120000);

      it('should create a web extension project and package successfully', async () => {
        const result = await runNxCommandAsync(`package ${project}`);
        expect(result.stdout).toContain('Your web extension is ready');
      }, 120000);
    });
  });
});
