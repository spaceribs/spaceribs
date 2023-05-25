import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';

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

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create a web extension project', async () => {
    const project = uniq('nx-web-ext');
    await runNxCommandAsync(
      `generate @spaceribs/nx-web-ext:application ${project} --no-interactive`
    );
    console.log('ran');
    const result = await runNxCommandAsync(`build ${project}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe.skip('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('nx-web-ext');
      await runNxCommandAsync(
        `generate @spaceribs/nx-web-ext:nx-web-ext ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${project}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe.skip('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('nx-web-ext');
      ensureNxProject('@spaceribs/nx-web-ext', 'dist/packages/nx-web-ext');
      await runNxCommandAsync(
        `generate @spaceribs/nx-web-ext:nx-web-ext ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${projectName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
