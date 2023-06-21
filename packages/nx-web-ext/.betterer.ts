const bettererTs = require('@betterer/typescript');
const bettererCoverage = require('@betterer/coverage');
const bettererEslint = require('@betterer/eslint');

const coverageSummary =
  '../../coverage/packages/nx-web-ext/coverage-summary.json';

module.exports = {
  'stricter compilation': () =>
    bettererTs
      .typescript('./tsconfig.lib.json', {
        strict: true,
      })
      .include('./src/**/*.ts')
      .exclude(/\.spec\.ts/gi),
  'increase per-file test coverage': () =>
    bettererCoverage.coverage(coverageSummary),
  'increase total test coverage': () =>
    bettererCoverage.coverageTotal(coverageSummary),
  'no more debuggers': () =>
    bettererEslint.eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts'),
  'no unsafe': () =>
    bettererEslint
      .eslint({ '@typescript-eslint/no-unsafe-call': 'error' })
      .include('./src/**/*.ts'),
};
