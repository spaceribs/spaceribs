import { joinPathFragments, ProjectConfiguration, Tree } from '@nx/devkit';
import { TypeDocOptions } from 'typedoc';
import { getTsConfig } from '../configureProject/getTsConfig';
import { outputFolder } from '../../utils';

type CLIOptions = 'options' | 'help' | 'version' | 'showConfig';

/**
 * Initializes basic defaults for typedoc.
 * @param tree - Filetree for the project
 * @param projectType - Either a library or application
 * @param root - The root of the project
 * @param name - The name of the project
 * @returns Typedoc Configuration
 */
export const getConfigDefaults = (
  tree: Tree,
  projectType: ProjectConfiguration['projectType'],
  root: ProjectConfiguration['root'],
  name: ProjectConfiguration['name'],
): Partial<Omit<TypeDocOptions, CLIOptions>> => ({
  entryPointStrategy: 'expand',
  entryPoints: ['./src/lib'],
  tsconfig: getTsConfig(projectType, root, tree),
  compilerOptions: {},
  exclude: [
    '**/*.(spec|test|e2e).ts',
    `${outputFolder}/**`,
    'tests/**',
    'specs/**',
    'spec/**',
    'test/**',
    '**/index.ts',
  ],
  externalPattern: ['**/node_modules/**'],
  excludeExternals: true,
  excludeInternal: false,
  excludePrivate: false,
  excludeProtected: false,
  excludeNotDocumented: false,
  externalSymbolLinkMappings: {},
  out: joinPathFragments(`../../${outputFolder}`, root),
  emit: 'docs',
  theme: 'hierarchy',
  name,
  includeVersion: true,
  readme: './README.md',
  disableSources: false,
  excludeTags: [],
  cname: '',
  sourceLinkTemplate: '',
  gitRevision: 'develop',
  gitRemote: 'origin',
  githubPages: true,
  hideGenerator: true,
  searchInComments: false,
  cleanOutputDir: true,
  titleLink: '',
  navigationLinks: {},
  sidebarLinks: {},
  commentStyle: 'all',
  categorizeByGroup: true,
  defaultCategory: 'Other',
  categoryOrder: [],
  sort: ['visibility', 'required-first', 'source-order'],
  visibilityFilters: {
    protected: true,
    private: true,
    inherited: true,
    external: true,
  },
  searchCategoryBoosts: {},
  searchGroupBoosts: {},
  preserveWatchOutput: false,
  skipErrorChecking: false,
  validation: {
    notExported: true,
    invalidLink: true,
    notDocumented: true,
  },
  requiredToBeDocumented: [],
  treatWarningsAsErrors: false,
  intentionallyNotExported: [],
  logLevel: 'Verbose',
  plugin: ['typedoc-plugin-rename-defaults', 'typedoc-theme-hierarchy'],
});
