const typescript = require('@betterer/typescript');

module.exports = {
  'stricter compilation': () =>
    typescript
      .typescript('./tsconfig.lib.json', {
        strict: true,
      })
      .include('./src/**/*.ts')
      .exclude(/\.spec\.ts/gi),
};
