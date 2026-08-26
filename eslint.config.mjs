import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nx from '@nx/eslint-plugin';
import * as jsoncEslintParser from 'jsonc-eslint-parser';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  ...nx.configs['flat/base'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  ...compat
    .config({
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:jsdoc/recommended-typescript-error',
      ],
      parserOptions: {
        project: './tsconfig.*?.json',
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        ...config.rules,
        'jsdoc/require-jsdoc': [
          'error',
          {
            contexts: [
              'ArrowFunctionExpression',
              'ClassDeclaration',
              'ClassExpression',
              'ClassProperty',
              'FunctionDeclaration',
              'FunctionExpression',
              'MethodDefinition',
              'TSTypeAliasDeclaration',
              'TSDeclareFunction',
              'TSEnumDeclaration',
              'TSMethodSignature',
              'TSModuleDeclaration',
              'TSPropertySignature',
            ],
            publicOnly: true,
            checkConstructors: false,
            require: {
              ArrowFunctionExpression: true,
              ClassDeclaration: true,
              ClassExpression: true,
              FunctionDeclaration: true,
              FunctionExpression: true,
              MethodDefinition: false,
            },
          },
        ],
        // The TypeScript preset disables the other require-*-type rules because
        // the types already live in the signature; @yields is no different.
        'jsdoc/require-yields-type': 'off',
        'jsdoc/require-hyphen-before-param-description': ['error', 'always'],
        'jsdoc/require-description': [
          'error',
          {
            contexts: [
              'ArrowFunctionExpression',
              'ClassDeclaration',
              'ClassExpression',
              'ClassProperty',
              'FunctionDeclaration',
              'FunctionExpression',
              'MethodDefinition',
              'TSTypeAliasDeclaration',
              'TSDeclareFunction',
              'TSEnumDeclaration',
              'TSMethodSignature',
              'TSModuleDeclaration',
              'TSPropertySignature',
            ],
            descriptionStyle: 'body',
          },
        ],
      },
    })),
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-extra-semi': 'off',
    },
  },
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
        '@typescript-eslint/no-explicit-any': 'off',
      },
    })),
  {
    files: ['package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          checkObsoleteDependencies: false,
          ignoredFiles: ['**/.betterer.ts'],
        },
      ],
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
  {
    files: ['**/.betterer.ts'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  {
    ignores: ['**/.betterer.ts'],
  },
];
