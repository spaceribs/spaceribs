import type { LibraryGeneratorSchema } from '@nx/js/internal';

export interface AssetLibraryGeneratorSchema extends LibraryGeneratorSchema {
  /**
   * Name of the new asset library.
   */
  name: string;
}
