# wang-tiles

<a href="https://www.npmjs.com/package/@spaceribs/wang-tiles" rel="nofollow">
  <img src="https://badgen.net/npm/v/@spaceribs/wang-tiles" alt="@spaceribs/wang-tiles NPM package">
</a>

A library for generating procedural worlds using Wang Tiles with customizable constraints and dimensions.

This library was generated with [Nx](https://nx.dev).

## Quick Start

1. Add `@spaceribs/wang-tiles` to your project:

   ```bash
   $ npm install @spaceribs/wang-tiles
   # or
   $ yarn add @spaceribs/wang-tiles
   ```

2. Import and use the library:

   ```typescript
   import { WangTile, WangTileSet, WangTileWorld, RandomGenerator } from '@spaceribs/wang-tiles';

   // Create a tileset
   const tileset = new WangTileSet<[number, number], string>();
   const floorTile = new WangTile<[number, number], string>('floor', 1);
   const wallTile = new WangTile<[number, number], string>('wall', 1);
   
   tileset.add(floorTile);
   tileset.add(wallTile);
   
   // Create a world
   const world = new WangTileWorld<
     [number, number],  // World dimensions
     [number, number],  // Chunk dimensions
     string
   >(
     tileset,
     [0, 0],    // World start
     [10, 10],  // World end
     [0, 0],    // Chunk start
     [5, 5],    // Chunk end
     'seed'     // Seed for reproducible generation
   );
   ```
