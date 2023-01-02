const typescript = require('@betterer/typescript');
const coverage = require('@betterer/coverage');
const eslint = require('@betterer/eslint');

const coverageSummary =
  '../../coverage/packages/nx-web-ext/coverage-summary.json';

module.exports = {
  'stricter compilation': () =>
    typescript
      .typescript('./tsconfig.lib.json', {
        strict: true,
      })
      .include('./src/**/*.ts')
      .exclude(/\.spec\.ts/gi),
  'increase per-file test coverage': () => coverage.coverage(coverageSummary),
  'increase total test coverage': () => coverage.coverageTotal(coverageSummary),
  'no more debuggers': () =>
    eslint.eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts'),
};
