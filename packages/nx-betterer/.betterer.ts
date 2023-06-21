const bettererTypescript = require('@betterer/typescript');

module.exports = {
  'stricter compilation': () =>
    bettererTypescript
      .typescript('./tsconfig.lib.json', {
        strict: true,
      })
      .include('./src/**/*.ts')
      .exclude(/.spec.ts/gi),
};
