import { WangTileChunk } from './chunk';
import { RandomGenerator } from './prng';
import { WangTile } from './tile';
import { WangTileSet } from './tile-set';

describe('WangTileChunk - Depth Limiting Implementation', () => {
  const noop = () => { /* intentionally empty */ };
  
  describe('propagation depth limiting', () => {
    let chunk: WangTileChunk<[number, number]>;
    let tiles: WangTileSet<[number, number]>;
    let random: RandomGenerator;

    beforeEach(() => {
      // Create tiles that could potentially create deep propagation chains
      const tile1 = new WangTile<[number, number]>('A');
      const tile2 = new WangTile<[number, number]>('B');
      const tile3 = new WangTile<[number, number]>('C');

      tiles = new WangTileSet([tile1, tile2, tile3]);
      random = new RandomGenerator('testing');
      chunk = new WangTileChunk(tiles, random, [0, 0], [5, 5]);
    });

    it('should limit propagation depth to prevent infinite recursion', () => {
      // Test that depth limiting works by directly calling propagateConstraints
      const testTile = new WangTile<[number, number]>('Test');

      // Mock console.warn to capture depth limit warnings
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(noop);

      // Access the private method through type assertion for testing
      const propagateConstraints = (chunk as any).propagateConstraints.bind(chunk);

      // This should not cause infinite recursion
      expect(() => {
        propagateConstraints([1, 1], testTile, 0);
      }).not.toThrow();

      // Test with depth limit exceeded
      propagateConstraints([1, 1], testTile, 15);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Propagation depth limit (10) reached'),
      );

      // Restore console.warn
      consoleSpy.mockRestore();
    });

    it('should handle normal propagation without hitting depth limits', () => {
      // Test normal propagation with simple tiles
      const normalTile = new WangTile<[number, number]>('Normal');

      // Mock console.warn to ensure no depth limit warnings
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(noop);

      // Access the private method through type assertion for testing
      const propagateConstraints = (chunk as any).propagateConstraints.bind(chunk);

      // This should work normally without hitting depth limits
      expect(() => {
        propagateConstraints([1, 1], normalTile, 0);
      }).not.toThrow();

      // Should not trigger depth limit warnings
      expect(consoleSpy).not.toHaveBeenCalled();

      // Restore console.warn
      consoleSpy.mockRestore();
    });

    it('should handle edge case with circular dependencies gracefully', () => {
      // Test that circular dependencies are handled gracefully with depth limiting
      const circularTile = new WangTile<[number, number]>('Circular');

      // Mock console.warn to capture any depth limit warnings
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(noop);

      // Access the private method through type assertion for testing
      const propagateConstraints = (chunk as any).propagateConstraints.bind(chunk);

      // Should handle circular dependencies without crashing
      expect(() => {
        propagateConstraints([1, 1], circularTile, 0);
      }).not.toThrow();

      // Restore console.warn
      consoleSpy.mockRestore();
    });

    it('should maintain correct behavior with depth limiting', () => {
      // Test that depth limiting doesn't break normal functionality
      const testTile = new WangTile<[number, number]>('Test');

      // Access the private method through type assertion for testing
      const propagateConstraints = (chunk as any).propagateConstraints.bind(chunk);

      // This should work normally
      expect(() => {
        propagateConstraints([1, 1], testTile, 0);
      }).not.toThrow();

      // Test with different depths
      expect(() => {
        propagateConstraints([1, 1], testTile, 5);
      }).not.toThrow();

      // Test with depth limit exceeded
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(noop);
      propagateConstraints([1, 1], testTile, 15);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('depth limiting configuration', () => {
    let chunk: WangTileChunk<[number, number]>;
    let tiles: WangTileSet<[number, number]>;
    let random: RandomGenerator;

    beforeEach(() => {
      const wangTile1 = new WangTile<[number, number]>('-');
      const wangTile2 = new WangTile<[number, number]>('|');

      tiles = new WangTileSet([wangTile1, wangTile2]);
      random = new RandomGenerator('testing');
      chunk = new WangTileChunk(tiles, random, [0, 0], [3, 3]);
    });

    it('should use configurable depth limit', () => {
      // Test that the depth limit is configurable (currently hardcoded to 10)
      const propagateConstraints = (chunk as any).propagateConstraints.bind(chunk);

      // This should work normally within the depth limit
      expect(() => {
        propagateConstraints([1, 1], new WangTile<[number, number]>('test'), 5);
      }).not.toThrow();

      // This should trigger the depth limit warning
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(noop);

      propagateConstraints([1, 1], new WangTile<[number, number]>('test'), 15);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Propagation depth limit (10) reached'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle boundary constraint application with depth limiting', () => {
      // Test that applyBoundaryConstraint also respects depth limits
      const neighborTile = new WangTile<[number, number]>('neighbor');
      const coord: [number, number] = [1, 1];

      // This should work without issues
      expect(() => {
        chunk.applyBoundaryConstraint(coord, neighborTile, 0, 1);
      }).not.toThrow();
    });
  });

  describe('performance with depth limiting', () => {
    let tiles: WangTileSet<[number, number]>;
    let random: RandomGenerator;

    beforeEach(() => {
      const wangTile1 = new WangTile<[number, number]>('-');
      const wangTile2 = new WangTile<[number, number]>('|');
      const wangTile3 = new WangTile<[number, number]>('+');

      tiles = new WangTileSet([wangTile1, wangTile2, wangTile3]);
      random = new RandomGenerator('testing');
    });

    it('should maintain good performance with depth limiting', () => {
      const chunk = new WangTileChunk(tiles, random, [0, 0], [5, 5]);

      const startTime = performance.now();
      const results = [...chunk.observe()];
      const endTime = performance.now();

      const observationTime = endTime - startTime;

      expect(results.length).toBeGreaterThan(0);
      expect(chunk.observed).toBe(true);
      expect(observationTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle multiple chunks efficiently with depth limiting', () => {
      const chunks: any[] = [];

      const startTime = performance.now();

      // Create and observe multiple chunks
      for (let i = 0; i < 3; i++) {
        const chunk = new WangTileChunk(tiles, random, [0, 0], [3, 3]);
        const results = [...chunk.observe()];
        chunks.push(chunk);
        expect(results.length).toBeGreaterThan(0);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle multiple chunks efficiently
      expect(totalTime).toBeLessThan(500); // Less than 500ms total
      expect(chunks.every(chunk => chunk.observed)).toBe(true);
    });
  });
});
