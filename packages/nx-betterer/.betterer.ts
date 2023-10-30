const bettererTypescript = require('@betterer/typescript');
const { eslintWarnings } = require('../betterer-eslint-warnings/src');

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
