import { BettererFileTest } from '@betterer/betterer';
import { ESLint } from 'eslint';

/**
 * Use this test to incrementally reduce {@link https://eslint.org/ | **ESLint**} warnings in
 * your codebase.
 * @example
 * ```typescript
 * import { eslint } from '@betterer/eslint';
 *
 * export default {
 *   'new eslint warnings': () =>
 *     eslintWarnings()
 *     .include('./src/*.ts')
 * };
 * ```
 * @returns a BettererFileTest which tracks the number of warnings on a project.
 */
export function eslintWarnings(): BettererFileTest {
  return new BettererFileTest(async (filePaths, fileTestResult, resolver) => {
    if (!filePaths.length) {
      return;
    }

    const { baseDirectory } = resolver;

    await Promise.all(
      filePaths.map(async (filePath) => {
        const runner = new ESLint({
          useEslintrc: true,
          cwd: baseDirectory,
        });

        const lintResults = await runner.lintFiles([filePath]);
        lintResults
          .filter((lintResult) => lintResult.source)
          .forEach((lintResult) => {
            const { messages, source } = lintResult;
            if (source == null) {
              throw new Error(`"${source}" was undefined.`);
            }
            const file = fileTestResult.addFile(filePath, source);
            messages
              .filter((message) => message.severity === 1)
              .forEach((message) => {
                const startLine = message.line - 1;
                const startColumn = message.column - 1;
                const endLine = message.endLine ? message.endLine - 1 : 0;
                const endColumn = message.endColumn ? message.endColumn - 1 : 0;
                file.addIssue(
                  startLine,
                  startColumn,
                  endLine,
                  endColumn,
                  message.message,
                );
              });
          });
      }),
    );
  });
}
