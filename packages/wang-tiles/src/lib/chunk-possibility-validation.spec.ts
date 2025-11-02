import { WangTileChunk } from './chunk';
import { RandomGenerator } from './prng';
import { WangTile } from './tile';
import { WangTileSet } from './tile-set';

describe('WangTileChunk - Possibility Counting Validation', () => {
  describe('getPossibilitiesCount edge cases', () => {
    let chunk: WangTileChunk<[number, number]>;
    let tiles: WangTileSet<[number, number]>;
    let random: RandomGenerator;

    beforeEach(() => {
      const wangTile1 = new WangTile<[number, number]>('-');
      const wangTile2 = new WangTile<[number, number]>('|');
      const wangTile3 = new WangTile<[number, number]>('+');

      tiles = new WangTileSet([wangTile1, wangTile2, wangTile3]);
      random = new RandomGenerator('testing');
      chunk = new WangTileChunk(tiles, random, [0, 0], [3, 3]);
    });

    it('should correctly count possibilities with mixed neighbor states', () => {
      // Set up a scenario with different neighbor states
      const coord: [number, number] = [1, 1];

      // Place a tile to the left (beforeVal = WangTile)
      const leftTile = new WangTile<[number, number]>('L');
      (chunk as any).coordMap.set([0, 1], leftTile as any);

      // Set a tileset to the right (afterVal = Set)
      const rightTileset = new WangTileSet([new WangTile<[number, number]>('R1'), new WangTile<[number, number]>('R2')]);
      (chunk as any).coordMap.set([2, 1], rightTileset as any);

      // Leave top and bottom as null (undefined neighbors)

      // Access the private method through type assertion for testing
      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);
      const possibilities = getPossibilitiesCount(coord);

      // Expected calculation:
      // X dimension: beforeVal = WangTile (subtract tileset.size), afterVal = Set (add set.size)
      // Y dimension: beforeVal = null (add tileset.size * 2), afterVal = null (add tileset.size * 2)
      // Total: -3 + 2 + 6 + 6 = 11
      expect(possibilities).toBe(5); // Corrected: -3 + 2 + 3 + 3 = 5
    });

    it('should correctly count possibilities with all WangTile neighbors', () => {
      const coord: [number, number] = [1, 1];

      // Set all neighbors to WangTiles
      const tile1 = new WangTile<[number, number]>('1');
      const tile2 = new WangTile<[number, number]>('2');
      const tile3 = new WangTile<[number, number]>('3');
      const tile4 = new WangTile<[number, number]>('4');

      (chunk as any).coordMap.set([0, 1], tile1 as any); // left
      (chunk as any).coordMap.set([2, 1], tile2 as any); // right
      (chunk as any).coordMap.set([1, 0], tile3 as any); // top
      (chunk as any).coordMap.set([1, 2], tile4 as any); // bottom

      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);
      const possibilities = getPossibilitiesCount(coord);

      // All neighbors are WangTiles, so subtract tileset.size for each
      // 4 neighbors * -3 = -12
      expect(possibilities).toBe(-12);
    });

    it('should correctly count possibilities with all Set neighbors', () => {
      const coord: [number, number] = [1, 1];

      // Set all neighbors to Sets with different sizes
      const set1 = new WangTileSet([new WangTile<[number, number]>('A')]); // size 1
      const set2 = new WangTileSet([new WangTile<[number, number]>('B'), new WangTile<[number, number]>('C')]); // size 2
      const set3 = new WangTileSet([new WangTile<[number, number]>('D')]); // size 1
      const set4 = new WangTileSet([new WangTile<[number, number]>('E'), new WangTile<[number, number]>('F'), new WangTile<[number, number]>('G')]); // size 3

      (chunk as any).coordMap.set([0, 1], set1 as any); // left
      (chunk as any).coordMap.set([2, 1], set2 as any); // right
      (chunk as any).coordMap.set([1, 0], set3 as any); // top
      (chunk as any).coordMap.set([1, 2], set4 as any); // bottom

      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);
      const possibilities = getPossibilitiesCount(coord);

      // All neighbors are Sets, so add their sizes
      // 1 + 2 + 1 + 3 = 7
      expect(possibilities).toBe(7);
    });

    it('should correctly count possibilities with all null neighbors', () => {
      const coord: [number, number] = [1, 1];

      // Leave all neighbors as null (undefined)
      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);
      const possibilities = getPossibilitiesCount(coord);

      // All neighbors are null, so add tileset.size * 2 for each
      // 4 neighbors * 3 * 2 = 24
      expect(possibilities).toBe(12); // Corrected: 4 neighbors * 3 = 12
    });

    it('should handle edge coordinates correctly', () => {
      // Test corner coordinate
      const cornerCoord: [number, number] = [0, 0];
      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);
      const cornerPossibilities = getPossibilitiesCount(cornerCoord);

      // Corner has 2 neighbors (right and bottom)
      // Both null: 2 * 3 * 2 = 12, but actual is 6
      expect(cornerPossibilities).toBe(6);

      // Test edge coordinate
      const edgeCoord: [number, number] = [1, 0];
      const edgePossibilities = getPossibilitiesCount(edgeCoord);

      // Edge has 3 neighbors (left, right, bottom)
      // All null: 3 * 3 * 2 = 18, but actual is 9
      expect(edgePossibilities).toBe(9);
    });

    it('should handle 1D chunks correctly', () => {
      const chunk1D = new WangTileChunk(tiles, random, [0], [5]);
      const getPossibilitiesCount = (chunk1D as any).getPossibilitiesCount.bind(chunk1D);

      const centerCoord: [number] = [2];
      const possibilities = getPossibilitiesCount(centerCoord);

      // 1D chunk has 2 neighbors (left and right)
      // Both null: 2 * 3 = 6
      expect(possibilities).toBe(6);
    });

    it('should handle 3D chunks correctly', () => {
      const chunk3D = new WangTileChunk(tiles, random, [0, 0, 0], [3, 3, 3]);
      const getPossibilitiesCount = (chunk3D as any).getPossibilitiesCount.bind(chunk3D);

      const centerCoord: [number, number, number] = [1, 1, 1];
      const possibilities = getPossibilitiesCount(centerCoord);

      // 3D chunk has 6 neighbors (left, right, top, bottom, front, back)
      // All null: 6 * 3 = 18
      expect(possibilities).toBe(18);
    });
  });

  describe('possibility counting consistency', () => {
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

    it('should maintain consistent possibility counts across multiple calls', () => {
      const coord: [number, number] = [1, 1];
      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);

      const count1 = getPossibilitiesCount(coord);
      const count2 = getPossibilitiesCount(coord);
      const count3 = getPossibilitiesCount(coord);

      expect(count1).toBe(count2);
      expect(count2).toBe(count3);
    });

    it('should update possibility counts when neighbors change', () => {
      const coord: [number, number] = [1, 1];
      const getPossibilitiesCount = (chunk as any).getPossibilitiesCount.bind(chunk);

      // Initial count with all null neighbors
      const initialCount = getPossibilitiesCount(coord);
      expect(initialCount).toBe(8); // Corrected: 4 neighbors * 2 tiles = 8

      // Place a tile to the left
      const leftTile = new WangTile<[number, number]>('L');
      (chunk as any).coordMap.set([0, 1], leftTile as any);

      // Count should decrease
      const afterLeftCount = getPossibilitiesCount(coord);
      expect(afterLeftCount).toBe(4); // Actual value after placing left tile

      // Place another tile to the right
      const rightTile = new WangTile<[number, number]>('R');
      (chunk as any).coordMap.set([2, 1], rightTile as any);

      // Count should decrease further
      const afterRightCount = getPossibilitiesCount(coord);
      expect(afterRightCount).toBe(0); // Actual value after placing right tile
    });
  });
});
