module.exports = {
  displayName: 'nx-web-ext',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/nx-web-ext',
  // Negative thresholds are a cap on uncovered entities rather than a percentage
  // floor, so these ratchet the way the betterer coverage tests used to: pinned
  // at today's numbers, and only ever lowered.
  coverageThreshold: {
    global: {
      lines: -139,
      statements: -157,
      functions: -30,
      branches: -62,
    },
  },
};
