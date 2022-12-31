const nxPreset = require('@nrwl/jest/preset').default;

module.exports = {
  ...nxPreset,
  testEnvironment: 'node',
  coverageReporters: ['html', 'lcov', 'json', 'json-summary'],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**',
    '!./**/*.html',
    '!./src/index.ts',
    '!./src/main.ts',
    '!./src/polyfills.ts',
    '!./src/**/*.stories.ts',
    '!./src/**/*.demo.ts',
    '!./src/**/*.models.ts',
    '!./src/**/*.model.ts',
  ],
};
