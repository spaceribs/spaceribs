import baseConfig from '../../eslint.config.mjs';
import * as jsoncEslintParser from 'jsonc-eslint-parser';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Was ratcheted by betterer; enforced outright now that it is clean.
      '@typescript-eslint/no-unsafe-call': 'error',
    },
    languageOptions: {
      parserOptions: {
        project: ['packages/nx-web-ext/tsconfig.*?.json'],
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: [
      './package.json',
      './project.json',
      './generators.json',
      './executors.json',
    ],
    rules: {
      '@nx/nx-plugin-checks': 'error',
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
];
