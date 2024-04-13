import configNxScopes from '@commitlint/config-nx-scopes';
const {
  utils: { getProjects },
} = configNxScopes;

export default {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  rules: {
    'body-max-line-length': [0, 'always', Infinity],
    'scope-enum': async (ctx) => [
      2,
      'always',
      [
        'deps',
        'deps-dev',
        ...getProjects(ctx, ({ name }) => !name.includes('e2e')),
      ],
    ],
  },
};
