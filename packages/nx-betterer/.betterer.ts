import { eslintWarnings } from '../betterer-eslint-warnings/src';

const bettererTypescript = require('@betterer/typescript');

module.exports = {
  'stricter compilation': () =>
    bettererTypescript
      .typescript('./tsconfig.lib.json', {
        strict: true,
      })
      .include('./src/**/*.ts')
      .exclude(/.spec.ts/gi),
  'new eslint warnings': () => eslintWarnings().include('./src/**/*.ts'),
};
