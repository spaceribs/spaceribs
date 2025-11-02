import { ConstraintCache } from './constraint-cache';
import { Edge } from './edge';
import { WangTile } from './tile';

describe('ConstraintCache', () => {
  let cache: ConstraintCache;
  let tile1: WangTile<[number, number]>;
  let tile2: WangTile<[number, number]>;
  let tile3: WangTile<[number, number]>;

  beforeEach(() => {
    cache = new ConstraintCache();
    tile1 = new WangTile<[number, number]>('tile1');
    tile2 = new WangTile<[number, number]>('tile2');
    tile3 = new WangTile<[number, number]>('tile3');
  });

  describe('getCachedResult and setCachedResult', () => {
    it('should return null when no cache entry exists', () => {
      const result = cache.getCachedResult([tile1, tile2], 'wall', [1, 0]);
      expect(result).toBeNull();
    });

    it('should store and retrieve cached results', () => {
      const originalTiles = [tile1, tile2, tile3];
      const filteredTiles = [tile1, tile2];

      cache.setCachedResult(originalTiles, filteredTiles, 'wall', [1, 0]);
      const result = cache.getCachedResult(originalTiles, 'wall', [1, 0]);

      expect(result).toHaveLength(2);
      expect(result).toContain(tile1);
      expect(result).toContain(tile2);
      expect(result).not.toContain(tile3);
    });

    it('should handle symbol edges', () => {
      const symbolEdge = Symbol('wall');
      const originalTiles = [tile1, tile2];
      const filteredTiles = [tile1];

      cache.setCachedResult(originalTiles, filteredTiles, symbolEdge, [1, 0]);
      const result = cache.getCachedResult(originalTiles, symbolEdge, [1, 0]);

      expect(result).toHaveLength(1);
      expect(result).toContain(tile1);
    });

    it('should handle different coordinates', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      cache.setCachedResult(originalTiles, [tile2], 'floor', [0, 1]);

      const result1 = cache.getCachedResult(originalTiles, 'wall', [1, 0]);
      const result2 = cache.getCachedResult(originalTiles, 'floor', [0, 1]);

      expect(result1).toHaveLength(1);
      expect(result1).toContain(tile1);
      expect(result2).toHaveLength(1);
      expect(result2).toContain(tile2);
    });

    it('should handle 3D coordinates', () => {
      const tile3D = new WangTile<[number, number, number]>('tile3D');
      const originalTiles = [tile3D];

      cache.setCachedResult(originalTiles, [tile3D], 'wall', [1, 0, 2]);
      const result = cache.getCachedResult(originalTiles, 'wall', [1, 0, 2]);

      expect(result).toHaveLength(1);
      expect(result).toContain(tile3D);
    });

    it('should return cached result only for exact tileset match', () => {
      const originalTiles = [tile1, tile2];
      const differentTiles = [tile3];

      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      const result = cache.getCachedResult(differentTiles, 'wall', [1, 0]);

      expect(result).toBeNull();
    });
  });

  describe('getCachedConstraintsResult and setCachedConstraintsResult', () => {
    it('should return null when no cache entry exists', () => {
      const result = cache.getCachedConstraintsResult([tile1, tile2], ['wall'], [1, 0]);
      expect(result).toBeNull();
    });

    it('should store and retrieve cached results for multiple constraints', () => {
      const originalTiles = [tile1, tile2, tile3];
      const filteredTiles = [tile1, tile3];

      cache.setCachedConstraintsResult(originalTiles, filteredTiles, ['wall', 'floor'], [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, ['wall', 'floor'], [1, 0]);

      expect(result).toHaveLength(2);
      expect(result).toContain(tile1);
      expect(result).toContain(tile3);
      expect(result).not.toContain(tile2);
    });

    it('should handle duplicate edges in constraints array', () => {
      const originalTiles = [tile1, tile2];
      const filteredTiles = [tile1];

      cache.setCachedConstraintsResult(originalTiles, filteredTiles, ['wall', 'wall'], [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, ['wall', 'wall'], [1, 0]);

      expect(result).toHaveLength(1);
    });

    it('should handle empty constraints array', () => {
      const originalTiles = [tile1, tile2];
      const filteredTiles: WangTile<[number, number]>[] = [];

      cache.setCachedConstraintsResult(originalTiles, filteredTiles, [], [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, [], [1, 0]);

      expect(result).toHaveLength(0);
    });

    it('should handle symbol edges in multiple constraints', () => {
      const symbolEdge = Symbol('door');
      const originalTiles = [tile1, tile2];
      const filteredTiles = [tile1];

      cache.setCachedConstraintsResult(originalTiles, filteredTiles, ['wall', symbolEdge], [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, ['wall', symbolEdge], [1, 0]);

      expect(result).toHaveLength(1);
    });
  });

  describe('cache expiration', () => {
    it('should not return expired cache entries', () => {
      const originalTiles = [tile1, tile2];
      const filteredTiles = [tile1];

      // Create a cache entry with an old timestamp
      cache.setCachedResult(originalTiles, filteredTiles, 'wall', [1, 0]);
      
      // Manually set the timestamp to be expired (older than maxCacheAge)
      const cacheMap = (cache as any).cache as Map<string, any>;
      const cacheKey = cacheMap.keys().next().value;
      if (!cacheKey) {
        throw new Error('Expected cache key to exist');
      }
      const entry = cacheMap.get(cacheKey);
      if (entry) {
        entry.timestamp = Date.now() - (61 * 60 * 1000); // 61 minutes ago
        cacheMap.set(cacheKey, entry);
      }

      const result = cache.getCachedResult(originalTiles, 'wall', [1, 0]);

      expect(result).toBeNull();
    });

    it('should clean up expired entries on lookup', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      
      // Make the entry expired
      const cacheMap = (cache as any).cache as Map<string, any>;
      const cacheKey = cacheMap.keys().next().value;
      if (!cacheKey) {
        throw new Error('Expected cache key to exist');
      }
      const entry = cacheMap.get(cacheKey);
      if (entry) {
        entry.timestamp = Date.now() - (61 * 60 * 1000);
        cacheMap.set(cacheKey, entry);
      }

      cache.getCachedResult(originalTiles, 'wall', [1, 0]);

      expect(cacheMap.size).toBe(0);
    });
  });

  describe('cache cleanup', () => {
    it('should clean up when max cache size is exceeded', () => {
      const originalTiles = [tile1, tile2];

      // Add enough entries to trigger cleanup
      for (let i = 0; i < 10001; i++) {
        cache.setCachedResult(originalTiles, [tile1], `edge${i}` as Edge, [i, 0]);
      }

      const metrics = cache.getMetrics();
      expect(metrics.cacheSize).toBeLessThan(10001);
    });

    it('should remove least recently hit entries during cleanup', () => {
      const originalTiles = [tile1, tile2];

      // Create entries with different hit counts
      for (let i = 0; i < 100; i++) {
        cache.setCachedResult(originalTiles, [tile1], `edge${i}` as Edge, [i, 0]);
        
        // Hit some entries multiple times
        if (i < 50) {
          for (let j = 0; j < i; j++) {
            cache.getCachedResult(originalTiles, `edge${i}` as Edge, [i, 0]);
          }
        }
      }

      // Trigger cleanup by exceeding max size
      for (let i = 100; i < 10001; i++) {
        cache.setCachedResult(originalTiles, [tile1], `edge${i}` as Edge, [i, 0]);
      }

      const metrics = cache.getMetrics();
      expect(metrics.cacheSize).toBeLessThan(10001);
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      cache.setCachedResult(originalTiles, [tile2], 'floor', [0, 1]);

      expect(cache.getMetrics().cacheSize).toBe(2);
      
      cache.clear();

      expect(cache.getMetrics().cacheSize).toBe(0);
      expect(cache.getCachedResult(originalTiles, 'wall', [1, 0])).toBeNull();
    });
  });

  describe('getMetrics', () => {
    it('should track cache hits and misses correctly', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      
      // Miss
      cache.getCachedResult([tile3], 'wall', [1, 0]);
      
      // Hit
      cache.getCachedResult(originalTiles, 'wall', [1, 0]);
      
      // Hit
      cache.getCachedResult(originalTiles, 'wall', [1, 0]);

      const metrics = cache.getMetrics();
      expect(metrics.totalLookups).toBe(3);
      expect(metrics.cacheHits).toBe(2);
      expect(metrics.cacheMisses).toBe(1);
      expect(metrics.hitRate).toBeCloseTo(66.67, 1);
    });

    it('should track hit count for each entry', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      
      // Hit the cache multiple times
      for (let i = 0; i < 10; i++) {
        cache.getCachedResult(originalTiles, 'wall', [1, 0]);
      }

      const cacheMap = (cache as any).cache as Map<string, any>;
      const entry = cacheMap.values().next().value;
      expect(entry.hitCount).toBe(10);
    });

    it('should calculate hit rate as percentage', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      
      // 10 hits, 5 misses
      for (let i = 0; i < 10; i++) {
        cache.getCachedResult(originalTiles, 'wall', [1, 0]);
      }
      for (let i = 0; i < 5; i++) {
        cache.getCachedResult(originalTiles, `edge${i}` as Edge, [1, 0]);
      }

      const metrics = cache.getMetrics();
      expect(metrics.hitRate).toBeCloseTo(66.67, 1);
    });

    it('should estimate memory usage', () => {
      const originalTiles = [tile1, tile2, tile3];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);

      const metrics = cache.getMetrics();
      expect(metrics.memoryUsage).toBeGreaterThan(0);
    });

    it('should track time saved by cache hits', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      
      // Hit the cache
      cache.getCachedResult(originalTiles, 'wall', [1, 0]);

      const metrics = cache.getMetrics();
      expect(metrics.timeSaved).toBeGreaterThanOrEqual(0);
    });
  });

  describe('resetMetrics', () => {
    it('should reset metrics while preserving cache', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);
      cache.getCachedResult(originalTiles, 'wall', [1, 0]);

      const metricsBefore = cache.getMetrics();
      expect(metricsBefore.totalLookups).toBeGreaterThan(0);
      expect(metricsBefore.cacheSize).toBe(1);

      cache.resetMetrics();

      const metricsAfter = cache.getMetrics();
      expect(metricsAfter.totalLookups).toBe(0);
      expect(metricsAfter.cacheHits).toBe(0);
      expect(metricsAfter.cacheMisses).toBe(0);
      expect(metricsAfter.cacheSize).toBe(1); // Cache entries preserved
    });
  });

  describe('generateTilesetHash', () => {
    it('should generate same hash for identical tilesets', () => {
      const tiles1 = [tile1, tile2];
      const tiles2 = [tile1, tile2];

      cache.setCachedResult(tiles1, [tile1], 'wall', [1, 0]);
      const result = cache.getCachedResult(tiles2, 'wall', [1, 0]);

      expect(result).toHaveLength(1);
    });

    it('should generate different hashes for different tilesets', () => {
      const tiles1 = [tile1, tile2];
      const tiles2 = [tile3];

      cache.setCachedResult(tiles1, [tile1], 'wall', [1, 0]);
      const result = cache.getCachedResult(tiles2, 'wall', [1, 0]);

      expect(result).toBeNull();
    });

    it('should consider tile constraints in hash generation', () => {
      const tileA = new WangTile<[number, number]>('A');
      tileA.addConstraint({ coords: [1, 0], edge: 'wall' });
      
      const tileB = new WangTile<[number, number]>('A'); // Same data
      // tileB has no constraints

      const tiles1 = [tileA];
      const tiles2 = [tileB];

      cache.setCachedResult(tiles1, [tileA], 'floor', [0, 1]);
      const result = cache.getCachedResult(tiles2, 'floor', [0, 1]);

      expect(result).toBeNull();
    });

    it('should handle tilesets with multiple constraints', () => {
      const tile = new WangTile<[number, number]>('A');
      tile.addConstraint({ coords: [1, 0], edge: 'wall' });
      tile.addConstraint({ coords: [0, 1], edge: 'floor' });
      tile.addConstraint({ coords: [-1, 0], edge: 'door' });

      const tiles = [tile];

      cache.setCachedResult(tiles, [tile], 'test', [2, 2]);
      const result = cache.getCachedResult(tiles, 'test', [2, 2]);

      expect(result).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('should handle empty tileset', () => {
      const result = cache.getCachedResult([], 'wall', [1, 0]);
      expect(result).toBeNull();

      cache.setCachedResult([], [], 'wall', [1, 0]);
      const result2 = cache.getCachedResult([], 'wall', [1, 0]);
      expect(result2).toHaveLength(0);
    });

    it('should handle tileset with single tile', () => {
      const tiles = [tile1];

      cache.setCachedResult(tiles, tiles, 'wall', [1, 0]);
      const result = cache.getCachedResult(tiles, 'wall', [1, 0]);

      expect(result).toHaveLength(1);
    });

    it('should handle very large tilesets', () => {
      const largeTileset: WangTile<[number, number]>[] = [];
      for (let i = 0; i < 1000; i++) {
        largeTileset.push(new WangTile<[number, number]>(`tile${i}`));
      }

      cache.setCachedResult(largeTileset, largeTileset.slice(0, 500), 'wall', [1, 0]);
      const result = cache.getCachedResult(largeTileset, 'wall', [1, 0]);

      expect(result).toHaveLength(500);
    });

    it('should handle cache with no hits', () => {
      const originalTiles = [tile1, tile2];
      
      cache.setCachedResult(originalTiles, [tile1], 'wall', [1, 0]);

      const metrics = cache.getMetrics();
      expect(metrics.cacheHits).toBe(0);
      expect(metrics.hitRate).toBe(0);
    });

    it('should handle negative coordinates', () => {
      const originalTiles = [tile1, tile2];

      cache.setCachedResult(originalTiles, [tile1], 'wall', [-1, -2]);
      const result = cache.getCachedResult(originalTiles, 'wall', [-1, -2]);

      expect(result).toHaveLength(1);
    });

    it('should handle coordinates with large values', () => {
      const originalTiles = [tile1, tile2];

      cache.setCachedResult(originalTiles, [tile1], 'wall', [1000, 5000]);
      const result = cache.getCachedResult(originalTiles, 'wall', [1000, 5000]);

      expect(result).toHaveLength(1);
    });
  });

  describe('multiple constraints edge cases', () => {
    it('should handle different edge order', () => {
      const originalTiles = [tile1, tile2];
      const filteredTiles = [tile1];

      cache.setCachedConstraintsResult(originalTiles, filteredTiles, ['a', 'b'], [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, ['b', 'a'], [1, 0]);

      expect(result).toHaveLength(1); // Should match due to sorting
    });

    it('should not match different edge combinations', () => {
      const originalTiles = [tile1, tile2];

      cache.setCachedConstraintsResult(originalTiles, [tile1], ['a', 'b'], [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, ['c', 'd'], [1, 0]);

      expect(result).toBeNull();
    });

    it('should handle many edges in constraint array', () => {
      const originalTiles = [tile1, tile2];
      const edges: Edge[] = [];
      for (let i = 0; i < 100; i++) {
        edges.push(`edge${i}` as Edge);
      }

      cache.setCachedConstraintsResult(originalTiles, [tile1], edges, [1, 0]);
      const result = cache.getCachedConstraintsResult(originalTiles, edges, [1, 0]);

      expect(result).toHaveLength(1);
    });
  });

  describe('performance and concurrency', () => {
    it('should handle rapid sequential operations', () => {
      const originalTiles = [tile1, tile2];

      for (let i = 0; i < 100; i++) {
        cache.setCachedResult(originalTiles, [tile1], `edge${i}` as Edge, [i, 0]);
        const result = cache.getCachedResult(originalTiles, `edge${i}` as Edge, [i, 0]);
        expect(result).toHaveLength(1);
      }

      const metrics = cache.getMetrics();
      expect(metrics.totalLookups).toBe(100);
      expect(metrics.cacheHits).toBe(100);
    });

    it('should maintain consistent state during cleanup', () => {
      const originalTiles = [tile1, tile2];

      // Fill cache to trigger cleanup
      for (let i = 0; i < 10001; i++) {
        cache.setCachedResult(originalTiles, [tile1], `edge${i}` as Edge, [i, 0]);
      }

      // Verify cache still works
      const result = cache.getCachedResult(originalTiles, 'edge500' as Edge, [500, 0]);
      expect(result).toBeDefined();
    });
  });
});

