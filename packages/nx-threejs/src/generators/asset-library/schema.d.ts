import type { LibraryGeneratorSchema } from '@nx/js/src/utils/schema';

export interface AssetLibraryGeneratorSchema extends LibraryGeneratorSchema {
  /**
   * Name of the new asset library.
   */
  name: string;
}
