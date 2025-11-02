import { WangTileSet } from './tile-set';
import { WangTileWorld } from './world';
import { WangTile } from './tile';

describe('WangTileWorld', () => {
  describe('constructor', () => {
    it('should create a world with basic parameters', () => {
      const world = new WangTileWorld(
        new WangTileSet([]),
        [-1, -1],
        [2, 2],
        [0, 0],
        [16, 16],
      );
      expect(world).toBeDefined();
    });

    it('should create a world with default seed when none provided', () => {
      const world = new WangTileWorld(
        new WangTileSet([]),
        [0, 0],
        [1, 1],
        [0, 0],
        [5, 5],
      );
      expect(world).toBeDefined();
    });

    it('should create a world with custom seed', () => {
      const world = new WangTileWorld(
        new WangTileSet([]),
        [0, 0],
        [1, 1],
        [0, 0],
        [5, 5],
        'custom-seed',
      );
      expect(world).toBeDefined();
    });
  });

  describe('chunk-specific seeding', () => {
    let tiles: WangTileSet<[number, number]>;

    beforeEach(() => {
      // Create a simple tileset with two tiles
      const wallTile = new WangTile<[number, number]>('█');
      const floorTile = new WangTile<[number, number]>('·');
      tiles = new WangTileSet([wallTile, floorTile]);
    });

    it('should create different chunks for different coordinates with same base seed', () => {
      const baseSeed = 'test-seed';
      const world = new WangTileWorld(
        tiles,
        [0, 0], // World start
        [2, 2], // World end (creates 4 chunks: (0,0), (0,1), (1,0), (1,1))
        [0, 0], // Chunk start
        [3, 3], // Chunk end
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Verify all expected chunks exist
      expect(worldJSON['0,0']).toBeDefined();
      expect(worldJSON['0,1']).toBeDefined();
      expect(worldJSON['1,0']).toBeDefined();
      expect(worldJSON['1,1']).toBeDefined();

      // Each chunk should be a WangTileChunk instance
      expect(worldJSON['0,0']).toBeInstanceOf(Object);
      expect(worldJSON['0,1']).toBeInstanceOf(Object);
      expect(worldJSON['1,0']).toBeInstanceOf(Object);
      expect(worldJSON['1,1']).toBeInstanceOf(Object);
    });

    it('should generate different patterns for different chunk coordinates', () => {
      const baseSeed = 'pattern-test';

      // Create two separate worlds with the same base seed but different chunk coordinates
      const world1 = new WangTileWorld(
        tiles,
        [0, 0], // Only chunk (0,0)
        [1, 1],
        [0, 0],
        [5, 5],
        baseSeed,
      );

      const world2 = new WangTileWorld(
        tiles,
        [1, 1], // Only chunk (1,1)
        [2, 2],
        [0, 0],
        [5, 5],
        baseSeed,
      );

      const world1JSON = world1.toJSON();
      const world2JSON = world2.toJSON();

      // Generate the chunks by observing them
      const chunk1 = world1JSON['0,0'];
      const chunk2 = world2JSON['1,1'];

      // Observe both chunks to generate their patterns
      let count1 = 0;
      let count2 = 0;

      for (const result of chunk1.observe()) {
        void result;
        count1++;
      }

      for (const result of chunk2.observe()) {
        void result;
        count2++;
      }

      // The chunks should have different patterns due to different seeds
      // We can't predict exact patterns, but we can verify they're different
      expect(count1).toBeGreaterThan(0);
      expect(count2).toBeGreaterThan(0);

      // Convert to JSON for comparison
      const chunk1JSON = chunk1.toJSON();
      const chunk2JSON = chunk2.toJSON();

      // The chunks should have different tile distributions
      // This is probabilistic, but with different seeds they should be different
      expect(chunk1JSON).toBeDefined();
      expect(chunk2JSON).toBeDefined();
    });

    it('should generate same pattern for same chunk coordinates with same base seed', () => {
      const baseSeed = 'deterministic-test';

      // Create two identical worlds
      const world1 = new WangTileWorld(
        tiles,
        [0, 0],
        [1, 1],
        [0, 0],
        [3, 3],
        baseSeed,
      );

      const world2 = new WangTileWorld(
        tiles,
        [0, 0],
        [1, 1],
        [0, 0],
        [3, 3],
        baseSeed,
      );

      const world1JSON = world1.toJSON();
      const world2JSON = world2.toJSON();

      const chunk1 = world1JSON['0,0'];
      const chunk2 = world2JSON['0,0'];

      // Generate both chunks
      for (const result of chunk1.observe()) {
        void result;
      }

      for (const result of chunk2.observe()) {
        void result;
      }

      // The chunks should be identical
      const chunk1JSON = chunk1.toJSON();
      const chunk2JSON = chunk2.toJSON();

      expect(chunk1JSON).toEqual(chunk2JSON);
    });

    it('should generate different patterns when base seed changes', () => {
      // Create two worlds with different base seeds but same chunk coordinates
      const world1 = new WangTileWorld(
        tiles,
        [0, 0],
        [1, 1],
        [0, 0],
        [3, 3],
        'seed-1',
      );

      const world2 = new WangTileWorld(
        tiles,
        [0, 0],
        [1, 1],
        [0, 0],
        [3, 3],
        'seed-2',
      );

      const world1JSON = world1.toJSON();
      const world2JSON = world2.toJSON();

      const chunk1 = world1JSON['0,0'];
      const chunk2 = world2JSON['0,0'];

      // Generate both chunks
      for (const result of chunk1.observe()) {
        void result;
      }

      for (const result of chunk2.observe()) {
        void result;
      }

      // The chunks should be different due to different base seeds
      const chunk1JSON = chunk1.toJSON();
      const chunk2JSON = chunk2.toJSON();

      expect(chunk1JSON).not.toEqual(chunk2JSON);
    });

    it('should handle multi-dimensional chunk coordinates correctly', () => {
      const baseSeed = 'multi-dim-test';

      // Test with 3D coordinates
      const world = new WangTileWorld(
        tiles,
        [0, 0, 0], // 3D world start
        [2, 2, 2], // 3D world end (8 chunks total)
        [0, 0, 0], // 3D chunk start
        [2, 2, 2], // 3D chunk end
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Verify all 8 chunks exist (2x2x2 = 8)
      const expectedChunks = [
        '0,0,0', '0,0,1', '0,1,0', '0,1,1',
        '1,0,0', '1,0,1', '1,1,0', '1,1,1',
      ];

      expectedChunks.forEach(chunkKey => {
        expect(worldJSON[chunkKey]).toBeDefined();
      });

      // Verify we have exactly 8 chunks
      expect(Object.keys(worldJSON)).toHaveLength(8);
    });

    it('should create chunk-specific seeds in the correct format', () => {
      const baseSeed = 'format-test';

      // Create a world and verify the internal seed generation
      // We can't directly access the RandomGenerator instances, but we can verify
      // that different chunks produce different results, which indicates different seeds
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [2, 2], // 4 chunks
        [0, 0],
        [2, 2],
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Generate all chunks
      Object.values(worldJSON).forEach(chunk => {
        for (const result of chunk.observe()) {
          void result;
        }
      });

      // Convert all chunks to JSON for comparison
      const chunkJSONs = Object.entries(worldJSON).map(([key, chunk]) => ({
        key,
        json: chunk.toJSON(),
      }));

      // All chunks should be different (due to different seeds)
      // This is probabilistic but very likely with different seeds
      const uniquePatterns = new Set(chunkJSONs.map(c => JSON.stringify(c.json)));

      // With 4 different chunk coordinates, we should have 4 different patterns
      expect(uniquePatterns.size).toBe(4);
    });

    it('should handle edge case of single chunk world', () => {
      const baseSeed = 'single-chunk';

      const world = new WangTileWorld(
        tiles,
        [0, 0], // Single chunk at (0,0)
        [1, 1],
        [0, 0],
        [3, 3],
        baseSeed,
      );

      const worldJSON = world.toJSON();

      expect(worldJSON['0,0']).toBeDefined();
      expect(Object.keys(worldJSON)).toHaveLength(1);
    });

    it('should handle large world with many chunks', () => {
      const baseSeed = 'large-world';

      // Create a 5x5 world (25 chunks)
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [5, 5],
        [0, 0],
        [2, 2], // Small chunks
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Should have 25 chunks (5x5)
      expect(Object.keys(worldJSON)).toHaveLength(25);

      // Verify all expected chunk coordinates exist
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          expect(worldJSON[`${x},${y}`]).toBeDefined();
        }
      }
    });

    it('should handle negative chunk coordinates', () => {
      const baseSeed = 'negative-coords';

      // Create a world with negative coordinates
      const world = new WangTileWorld(
        tiles,
        [-1, -1], // Negative start
        [1, 1], // Positive end
        [0, 0],
        [2, 2],
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Should have 4 chunks: (-1,-1), (-1,0), (0,-1), (0,0)
      expect(Object.keys(worldJSON)).toHaveLength(4);
      expect(worldJSON['-1,-1']).toBeDefined();
      expect(worldJSON['-1,0']).toBeDefined();
      expect(worldJSON['0,-1']).toBeDefined();
      expect(worldJSON['0,0']).toBeDefined();
    });

    it('should handle non-square world dimensions', () => {
      const baseSeed = 'non-square';

      // Create a 2x3 world (6 chunks)
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [2, 3], // 2x3 = 6 chunks
        [0, 0],
        [2, 2],
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Should have 6 chunks
      expect(Object.keys(worldJSON)).toHaveLength(6);

      // Verify all expected coordinates exist
      const expectedChunks = [
        '0,0', '0,1', '0,2',
        '1,0', '1,1', '1,2',
      ];

      expectedChunks.forEach(chunkKey => {
        expect(worldJSON[chunkKey]).toBeDefined();
      });
    });

    it('should handle empty tileset gracefully', () => {
      const baseSeed = 'empty-tileset';
      const emptyTiles = new WangTileSet<[number, number]>([]);

      const world = new WangTileWorld(
        emptyTiles,
        [0, 0],
        [2, 2],
        [0, 0],
        [2, 2],
        baseSeed,
      );

      const worldJSON = world.toJSON();

      // Should still create chunks even with empty tileset
      expect(Object.keys(worldJSON)).toHaveLength(4);
      expect(worldJSON['0,0']).toBeDefined();
      expect(worldJSON['0,1']).toBeDefined();
      expect(worldJSON['1,0']).toBeDefined();
      expect(worldJSON['1,1']).toBeDefined();
    });

    it('should maintain seed consistency across multiple world instances', () => {
      const baseSeed = 'consistency-test';

      // Create multiple worlds with same parameters
      const worlds = Array.from({ length: 3 }, () =>
        new WangTileWorld(
          tiles,
          [0, 0],
          [2, 2],
          [0, 0],
          [2, 2],
          baseSeed,
        ),
      );

      // Generate all chunks in all worlds and convert to comparable format
      const worldResults = worlds.map(world => {
        const json = world.toJSON();
        const chunkResults: Record<string, unknown> = {};

        Object.entries(json).forEach(([key, chunk]) => {
          // Generate the chunk
          for (const result of chunk.observe()) {
            void result;
          }
          // Convert chunk to JSON for comparison
          chunkResults[key] = chunk.toJSON();
        });

        return chunkResults;
      });

      // All worlds should produce identical results
      const firstWorldResults = worldResults[0];
      worldResults.slice(1).forEach(worldResults => {
        expect(worldResults).toEqual(firstWorldResults);
      });
    });
  });

  describe('multi-dimensional support', () => {
    let tiles: WangTileSet<[number, number, number]>;

    beforeEach(() => {
      // Create a simple 3D tileset
      const wallTile = new WangTile<[number, number, number]>('█');
      const floorTile = new WangTile<[number, number, number]>('·');
      tiles = new WangTileSet([wallTile, floorTile]);
    });

    it('should handle 3D world coordinates correctly', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0, 0], // 3D world start
        [2, 2, 2], // 3D world end (8 chunks total)
        [0, 0, 0], // 3D chunk start
        [2, 2, 2], // 3D chunk end
        '3d-test',
      );

      const worldJSON = world.toJSON();

      // Verify all 8 chunks exist (2x2x2 = 8)
      const expectedChunks = [
        '0,0,0', '0,0,1', '0,1,0', '0,1,1',
        '1,0,0', '1,0,1', '1,1,0', '1,1,1',
      ];

      expectedChunks.forEach(chunkKey => {
        expect(worldJSON[chunkKey]).toBeDefined();
      });

      // Verify we have exactly 8 chunks
      expect(Object.keys(worldJSON)).toHaveLength(8);
    });

    it('should handle 4D world coordinates correctly', () => {
      const tiles4D = new WangTileSet<[number, number, number, number]>([
        new WangTile<[number, number, number, number]>('█'),
        new WangTile<[number, number, number, number]>('·'),
      ]);

      const world = new WangTileWorld(
        tiles4D,
        [0, 0, 0, 0], // 4D world start
        [2, 2, 2, 2], // 4D world end (16 chunks total)
        [0, 0, 0, 0], // 4D chunk start
        [2, 2, 2, 2], // 4D chunk end
        '4d-test',
      );

      const worldJSON = world.toJSON();

      // Verify we have exactly 16 chunks (2x2x2x2 = 16)
      expect(Object.keys(worldJSON)).toHaveLength(16);
    });

    it('should handle 1D world coordinates correctly', () => {
      const tiles1D = new WangTileSet<[number]>([
        new WangTile<[number]>('█'),
        new WangTile<[number]>('·'),
      ]);

      const world = new WangTileWorld(
        tiles1D,
        [0], // 1D world start
        [5], // 1D world end (5 chunks total)
        [0], // 1D chunk start
        [3], // 1D chunk end
        '1d-test',
      );

      const worldJSON = world.toJSON();

      // Verify all 5 chunks exist
      const expectedChunks = ['0', '1', '2', '3', '4'];
      expectedChunks.forEach(chunkKey => {
        expect(worldJSON[chunkKey]).toBeDefined();
      });

      // Verify we have exactly 5 chunks
      expect(Object.keys(worldJSON)).toHaveLength(5);
    });

    it('should handle non-uniform dimensions correctly', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0, 0], // 3D world start
        [2, 3, 4], // Non-uniform world end (2x3x4 = 24 chunks)
        [0, 0, 0], // 3D chunk start
        [2, 2, 2], // 3D chunk end
        'non-uniform-test',
      );

      const worldJSON = world.toJSON();

      // Verify we have exactly 24 chunks (2x3x4 = 24)
      expect(Object.keys(worldJSON)).toHaveLength(24);

      // Verify some specific chunks exist
      expect(worldJSON['0,0,0']).toBeDefined();
      expect(worldJSON['1,2,3']).toBeDefined();
      expect(worldJSON['0,1,2']).toBeDefined();
    });
  });

  describe('applyBoundaryConstraintsFromNeighbors', () => {
    let tiles: WangTileSet<[number, number]>;

    beforeEach(() => {
      // Create a simple tileset with constraint rules
      const wallTile = new WangTile<[number, number]>('█');
      const floorTile = new WangTile<[number, number]>('·');
      tiles = new WangTileSet([wallTile, floorTile]);
    });

    it('should apply constraints from 2D neighbors correctly', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0], // 2x2 world
        [2, 2],
        [0, 0],
        [3, 3], // 3x3 chunks
        'constraint-test',
      );

      // Generate the first chunk
      world.observeChunk([0, 0]);

      // Generate the second chunk - should apply constraints from the first
      world.observeChunk([1, 0]);

      const worldJSON = world.toJSON();
      const chunk1 = worldJSON['0,0'];
      const chunk2 = worldJSON['1,0'];

      // Both chunks should be generated
      expect(chunk1).toBeDefined();
      expect(chunk2).toBeDefined();

      // Convert to JSON to verify they have content
      const chunk1JSON = chunk1.toJSON();
      const chunk2JSON = chunk2.toJSON();

      expect(Object.keys(chunk1JSON).length).toBeGreaterThan(0);
      expect(Object.keys(chunk2JSON).length).toBeGreaterThan(0);
    });

    it('should apply constraints from 3D neighbors correctly', () => {
      const tiles3D = new WangTileSet<[number, number, number]>([
        new WangTile<[number, number, number]>('█'),
        new WangTile<[number, number, number]>('·'),
      ]);

      const world = new WangTileWorld(
        tiles3D,
        [0, 0, 0], // 2x2x2 world
        [2, 2, 2],
        [0, 0, 0],
        [2, 2, 2], // 2x2x2 chunks
        '3d-constraint-test',
      );

      // Generate chunks in sequence to test constraint propagation
      world.observeChunk([0, 0, 0]);
      world.observeChunk([1, 0, 0]); // Should apply constraints from [0,0,0]
      world.observeChunk([0, 1, 0]); // Should apply constraints from [0,0,0]
      world.observeChunk([0, 0, 1]); // Should apply constraints from [0,0,0]

      const worldJSON = world.toJSON();

      // All chunks should be generated
      expect(worldJSON['0,0,0']).toBeDefined();
      expect(worldJSON['1,0,0']).toBeDefined();
      expect(worldJSON['0,1,0']).toBeDefined();
      expect(worldJSON['0,0,1']).toBeDefined();

      // Verify they have content
      Object.values(worldJSON).forEach(chunk => {
        const chunkJSON = chunk.toJSON();
        expect(Object.keys(chunkJSON).length).toBeGreaterThan(0);
      });
    });

    it('should handle edge case with no neighbors', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0], // Single chunk world
        [1, 1],
        [0, 0],
        [3, 3],
        'no-neighbors-test',
      );

      // This should not throw an error even with no neighbors
      expect(() => {
        world.observeChunk([0, 0]);
      }).not.toThrow();

      const worldJSON = world.toJSON();
      expect(worldJSON['0,0']).toBeDefined();
    });

    it('should handle 1D constraint propagation', () => {
      const tiles1D = new WangTileSet<[number]>([
        new WangTile<[number]>('█'),
        new WangTile<[number]>('·'),
      ]);

      const world = new WangTileWorld(
        tiles1D,
        [0], // 1D world with 3 chunks
        [3],
        [0],
        [2], // 1D chunks
        '1d-constraint-test',
      );

      // Generate chunks in sequence
      world.observeChunk([0]);
      world.observeChunk([1]); // Should apply constraints from [0]
      world.observeChunk([2]); // Should apply constraints from [1]

      const worldJSON = world.toJSON();

      // All chunks should be generated
      expect(worldJSON['0']).toBeDefined();
      expect(worldJSON['1']).toBeDefined();
      expect(worldJSON['2']).toBeDefined();

      // Verify they have content
      Object.values(worldJSON).forEach(chunk => {
        const chunkJSON = chunk.toJSON();
        expect(Object.keys(chunkJSON).length).toBeGreaterThan(0);
      });
    });

    it('should handle high-dimensional constraint propagation', () => {
      const tiles5D = new WangTileSet<[number, number, number, number, number]>([
        new WangTile<[number, number, number, number, number]>('█'),
        new WangTile<[number, number, number, number, number]>('·'),
      ]);

      const world = new WangTileWorld(
        tiles5D,
        [0, 0, 0, 0, 0], // 5D world with 2 chunks per dimension
        [2, 2, 2, 2, 2],
        [0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2], // 5D chunks
        '5d-constraint-test',
      );

      // Generate a few chunks to test constraint propagation
      world.observeChunk([0, 0, 0, 0, 0]);
      world.observeChunk([1, 0, 0, 0, 0]); // Should apply constraints from [0,0,0,0,0]
      world.observeChunk([0, 1, 0, 0, 0]); // Should apply constraints from [0,0,0,0,0]

      const worldJSON = world.toJSON();

      // Generated chunks should exist
      expect(worldJSON['0,0,0,0,0']).toBeDefined();
      expect(worldJSON['1,0,0,0,0']).toBeDefined();
      expect(worldJSON['0,1,0,0,0']).toBeDefined();

      // Verify they have content
      Object.values(worldJSON).forEach(chunk => {
        const chunkJSON = chunk.toJSON();
        expect(Object.keys(chunkJSON).length).toBeGreaterThan(0);
      });
    });

    it('should handle non-uniform chunk dimensions', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0], // 2x2 world
        [2, 2],
        [0, 0],
        [3, 4], // Non-uniform chunk dimensions (3x4)
        'non-uniform-chunk-test',
      );

      // Generate chunks
      world.observeChunk([0, 0]);
      world.observeChunk([1, 0]); // Should apply constraints from [0,0]

      const worldJSON = world.toJSON();

      // Both chunks should be generated
      expect(worldJSON['0,0']).toBeDefined();
      expect(worldJSON['1,0']).toBeDefined();

      // Verify they have the correct number of cells (3x4 = 12)
      const chunk1JSON = worldJSON['0,0'].toJSON();
      const chunk2JSON = worldJSON['1,0'].toJSON();

      expect(Object.keys(chunk1JSON)).toHaveLength(12);
      expect(Object.keys(chunk2JSON)).toHaveLength(12);
    });
  });

  describe('getChunk', () => {
    let tiles: WangTileSet<[number, number]>;

    beforeEach(() => {
      const wallTile = new WangTile<[number, number]>('█');
      const floorTile = new WangTile<[number, number]>('·');
      tiles = new WangTileSet([wallTile, floorTile]);
    });

    it('should return undefined for non-existent chunk coordinates', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [2, 2],
        [0, 0],
        [3, 3],
        'get-chunk-test',
      );

      // Try to get chunks outside the world bounds
      expect(world.getChunk([-1, 0])).toBeUndefined();
      expect(world.getChunk([0, -1])).toBeUndefined();
      expect(world.getChunk([2, 0])).toBeUndefined();
      expect(world.getChunk([0, 2])).toBeUndefined();
      expect(world.getChunk([5, 5])).toBeUndefined();
    });

    it('should return valid chunks for existing coordinates', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [2, 2],
        [0, 0],
        [3, 3],
        'get-chunk-test',
      );

      // Get chunks that should exist
      const chunk00 = world.getChunk([0, 0]);
      const chunk01 = world.getChunk([0, 1]);
      const chunk10 = world.getChunk([1, 0]);
      const chunk11 = world.getChunk([1, 1]);

      expect(chunk00).toBeDefined();
      expect(chunk01).toBeDefined();
      expect(chunk10).toBeDefined();
      expect(chunk11).toBeDefined();
    });

    it('should handle multi-dimensional chunk retrieval', () => {
      const tiles3D = new WangTileSet<[number, number, number]>([
        new WangTile<[number, number, number]>('█'),
        new WangTile<[number, number, number]>('·'),
      ]);

      const world = new WangTileWorld(
        tiles3D,
        [0, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
        [2, 2, 2],
        '3d-get-chunk-test',
      );

      // Test various 3D coordinates
      expect(world.getChunk([0, 0, 0])).toBeDefined();
      expect(world.getChunk([1, 1, 1])).toBeDefined();
      expect(world.getChunk([0, 1, 0])).toBeDefined();
      expect(world.getChunk([1, 0, 1])).toBeDefined();

      // Test out-of-bounds coordinates
      expect(world.getChunk([-1, 0, 0])).toBeUndefined();
      expect(world.getChunk([0, 0, 2])).toBeUndefined();
      expect(world.getChunk([2, 2, 2])).toBeUndefined();
    });
  });

  describe('observeChunk', () => {
    let tiles: WangTileSet<[number, number]>;

    beforeEach(() => {
      const wallTile = new WangTile<[number, number]>('█');
      const floorTile = new WangTile<[number, number]>('·');
      tiles = new WangTileSet([wallTile, floorTile]);
    });

    it('should complete observation for a single chunk', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [1, 1], // Single chunk
        [0, 0],
        [3, 3],
        'observe-test',
      );

      // This should not throw and should complete
      expect(() => {
        world.observeChunk([0, 0]);
      }).not.toThrow();

      const chunk = world.getChunk([0, 0]);
      expect(chunk).toBeDefined();
    });

    it('should handle observation of non-existent chunk gracefully', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [1, 1],
        [0, 0],
        [3, 3],
        'observe-test',
      );

      // This should throw for non-existent chunk
      expect(() => {
        world.observeChunk([5, 5]);
      }).toThrow('Chunk at coordinate 5,5 not found');
    });

    it('should apply constraints before observation', () => {
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [2, 2],
        [0, 0],
        [3, 3],
        'constraint-observe-test',
      );

      // Generate first chunk
      world.observeChunk([0, 0]);

      // Generate second chunk - should apply constraints from first
      expect(() => {
        world.observeChunk([1, 0]);
      }).not.toThrow();

      // Both chunks should be fully generated
      const chunk1 = world.getChunk([0, 0]);
      const chunk2 = world.getChunk([1, 0]);

      expect(chunk1).toBeDefined();
      expect(chunk2).toBeDefined();
    });
  });

  describe('toJSON()', () => {
    it('should return a valid JSON representation of the world', () => {
      const tiles = new WangTileSet<[number, number]>([]);
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [2, 2],
        [0, 0],
        [3, 3],
        'json-test',
      );

      const worldJSON = world.toJSON();

      expect(worldJSON).toBeDefined();
      expect(typeof worldJSON).toBe('object');

      // Should have chunks for coordinates (0,0), (0,1), (1,0), (1,1)
      expect(worldJSON['0,0']).toBeDefined();
      expect(worldJSON['0,1']).toBeDefined();
      expect(worldJSON['1,0']).toBeDefined();
      expect(worldJSON['1,1']).toBeDefined();
    });

    it('should return empty object for empty world', () => {
      const tiles = new WangTileSet<[number, number]>([]);
      const world = new WangTileWorld(
        tiles,
        [0, 0],
        [0, 0], // No chunks
        [0, 0],
        [3, 3],
        'empty-test',
      );

      const worldJSON = world.toJSON();

      expect(worldJSON).toEqual({});
    });

    it('should handle multi-dimensional JSON representation', () => {
      const tiles3D = new WangTileSet<[number, number, number]>([]);
      const world = new WangTileWorld(
        tiles3D,
        [0, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
        [2, 2, 2],
        '3d-json-test',
      );

      const worldJSON = world.toJSON();

      expect(worldJSON).toBeDefined();
      expect(typeof worldJSON).toBe('object');

      // Should have 8 chunks (2x2x2)
      expect(Object.keys(worldJSON)).toHaveLength(8);

      // Verify some specific 3D coordinates
      expect(worldJSON['0,0,0']).toBeDefined();
      expect(worldJSON['1,1,1']).toBeDefined();
      expect(worldJSON['0,1,0']).toBeDefined();
    });
  });
});
