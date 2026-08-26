import type { libraryGenerator } from '@nx/js';

/**
 * Options accepted by `@nx/js`'s library generator.
 *
 * Derived from the generator's public signature rather than imported from
 * `@nx/js/internal`, which only exists on Nx 23 — earlier majors exposed the
 * same type under `@nx/js/src/generators/library/schema`.
 */
type LibraryGeneratorSchema = Parameters<typeof libraryGenerator>[1];

export interface AssetLibraryGeneratorSchema extends LibraryGeneratorSchema {
  /**
   * Name of the new asset library.
   */
  name: string;
}
