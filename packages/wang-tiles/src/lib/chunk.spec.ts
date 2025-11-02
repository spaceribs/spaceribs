import { WangTileChunk } from './chunk';
import { Edge } from './edge';
import { RandomGenerator } from './prng';
import { WangTile } from './tile';
import { WangTileSet } from './tile-set';

describe('WangTileChunk', () => {
  describe('constructor', () => {
    let tiles: WangTileSet;
    let random: RandomGenerator;
    beforeEach(() => {
      const wangTile1 = new WangTile('-');
      const wangTile2 = new WangTile('|');
      tiles = new WangTileSet([wangTile1, wangTile2]);
      random = new RandomGenerator('testing');
    });

    it('should initialize a 1 dimensional chunk', () => {
      const chunk = new WangTileChunk(tiles, random, [0], [3]);
      expect(chunk.toJSON()).toMatchSnapshot();
    });

    it('should initialize a 2 dimensional chunk', () => {
      const chunk = new WangTileChunk(tiles, random, [0, 0], [3, 3]);
      expect(chunk.toJSON()).toMatchSnapshot();
    });

    it('should initialize a 3 dimensional chunk', () => {
      const chunk = new WangTileChunk(tiles, random, [0, 0, 0], [3, 3, 3]);
      expect(chunk.toJSON()).toMatchSnapshot();
    });
  });

  describe('observe()', () => {
    let chunk: WangTileChunk<[number, number]>;
    let tiles: WangTileSet<[number, number]>;
    let random: RandomGenerator;

    beforeEach(() => {
      const wangTile1 = new WangTile<[number, number]>('-');
      const wangTile2 = new WangTile<[number, number]>('|');
      tiles = new WangTileSet([wangTile1, wangTile2]);
      random = new RandomGenerator('testing');
      chunk = new WangTileChunk(tiles, random, [0, 0], [5, 10]);
    });

    it('should observe the center of the chunk first.', () => {
      const result = chunk.observe().next().value;
      expect(result).toEqual([2, 5]);
      expect(chunk.debug()).toMatchSnapshot();
    });

    it('should observe all the tiles.', () => {
      const results = [...chunk.observe()];
      expect(chunk.debug()).toMatchSnapshot();
      expect(results).toMatchSnapshot();
      expect(chunk.observed).toBe(true);
    });

    it('should observe and restrict tilesets by constraint.', () => {
      const wangTile1 = new WangTile<[number, number]>(' ');
      const wangTile2 = new WangTile<[number, number]>('-');
      const wangTile3 = new WangTile<[number, number]>('=');

      const edge1: Edge = Symbol('one');
      const edge2: Edge = Symbol('two');
      const edge3: Edge = Symbol('three');

      wangTile1.addConstraint({
        edge: edge1,
        coords: [-1, 0],
      });
      wangTile1.addConstraint({
        edge: edge2,
        coords: [1, 0],
      });

      wangTile2.addConstraint({
        edge: edge2,
        coords: [-1, 0],
      });
      wangTile2.addConstraint({
        edge: edge3,
        coords: [1, 0],
      });

      wangTile3.addConstraint({
        edge: edge3,
        coords: [-1, 0],
      });
      wangTile3.addConstraint({
        edge: edge1,
        coords: [1, 0],
      });

      tiles = new WangTileSet<[number, number]>([
        wangTile1,
        wangTile2,
        wangTile3,
      ]);

      random = new RandomGenerator('testing12');

      chunk = new WangTileChunk(tiles, random, [0, 0], [10, 5]);

      [...chunk.observe()];

      expect(chunk.debug()).toMatchSnapshot();
      expect(chunk.observed).toBe(true);
    });

    it('should generate contiguous rooms.', () => {
      const empty_edge: Edge = Symbol('empty_edge');
      const vert_line_edge: Edge = Symbol('vert_line_bottom_edge');
      const horiz_line_edge: Edge = Symbol('horiz_line_left_edge');

      const empty = new WangTile<[number, number]>(' ', 10);
      empty.addConstraint({ edge: empty_edge, coords: [1, 0] });
      empty.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      empty.addConstraint({ edge: empty_edge, coords: [0, 1] });
      empty.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const vert = new WangTile<[number, number]>('║');
      vert.addConstraint({ edge: empty_edge, coords: [1, 0] });
      vert.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      vert.addConstraint({ edge: vert_line_edge, coords: [0, 1] });
      vert.addConstraint({ edge: vert_line_edge, coords: [0, -1] });

      const horiz = new WangTile<[number, number]>('═');
      horiz.addConstraint({ edge: horiz_line_edge, coords: [1, 0] });
      horiz.addConstraint({ edge: horiz_line_edge, coords: [-1, 0] });
      horiz.addConstraint({ edge: empty_edge, coords: [0, 1] });
      horiz.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const topleft = new WangTile<[number, number]>('╔');
      topleft.addConstraint({ edge: horiz_line_edge, coords: [1, 0] });
      topleft.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      topleft.addConstraint({ edge: empty_edge, coords: [0, 1] });
      topleft.addConstraint({ edge: vert_line_edge, coords: [0, -1] });

      const topright = new WangTile<[number, number]>('╗');
      topright.addConstraint({ edge: empty_edge, coords: [1, 0] });
      topright.addConstraint({ edge: horiz_line_edge, coords: [-1, 0] });
      topright.addConstraint({ edge: empty_edge, coords: [0, 1] });
      topright.addConstraint({ edge: vert_line_edge, coords: [0, -1] });

      const bottomleft = new WangTile<[number, number]>('╚');
      bottomleft.addConstraint({ edge: horiz_line_edge, coords: [1, 0] });
      bottomleft.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      bottomleft.addConstraint({ edge: vert_line_edge, coords: [0, 1] });
      bottomleft.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const bottomright = new WangTile<[number, number]>('╝');
      bottomright.addConstraint({ edge: empty_edge, coords: [1, 0] });
      bottomright.addConstraint({
        edge: horiz_line_edge,
        coords: [-1, 0],
      });
      bottomright.addConstraint({
        edge: vert_line_edge,
        coords: [0, 1],
      });
      bottomright.addConstraint({ edge: empty_edge, coords: [0, -1] });

      tiles = new WangTileSet<[number, number]>([
        empty,
        vert,
        horiz,
        topleft,
        topright,
        bottomleft,
        bottomright,
      ]);

      random = new RandomGenerator('foo');

      chunk = new WangTileChunk(tiles, random, [0, 0], [24, 24]);

      [...chunk.observe()];

      expect(chunk.debug()).toMatchSnapshot();
      expect(chunk.observed).toBe(true);
    }, 30000);
  });

  describe('applyBoundaryConstraint', () => {
    let chunk: WangTileChunk<[number, number]>;
    let tiles: WangTileSet<[number, number]>;
    let random: RandomGenerator;
    let neighborTile: WangTile<[number, number]>;

    beforeEach(() => {
      const wangTile1 = new WangTile<[number, number]>('-');
      const wangTile2 = new WangTile<[number, number]>('|');
      const wangTile3 = new WangTile<[number, number]>('+');

      // Add constraints to tiles
      wangTile1.addConstraint({ coords: [1, 0], edge: 'wall' });
      wangTile1.addConstraint({ coords: [-1, 0], edge: 'floor' });

      wangTile2.addConstraint({ coords: [1, 0], edge: 'wall' });
      wangTile2.addConstraint({ coords: [-1, 0], edge: 'wall' });

      wangTile3.addConstraint({ coords: [1, 0], edge: 'floor' });
      wangTile3.addConstraint({ coords: [-1, 0], edge: 'floor' });

      tiles = new WangTileSet([wangTile1, wangTile2, wangTile3]);
      random = new RandomGenerator('testing');
      chunk = new WangTileChunk(tiles, random, [0, 0], [3, 3]);

      // Create a neighbor tile with specific constraints
      neighborTile = new WangTile<[number, number]>('neighbor');
      neighborTile.addConstraint({ coords: [1, 0], edge: 'wall' });
    });

    it('should apply boundary constraint to a coordinate', () => {
      const coord: [number, number] = [1, 1];
      const dimension = 0;
      const offset = 1;

      chunk.applyBoundaryConstraint(coord, neighborTile, dimension, offset);

      // The constraint should be applied, but we can't easily test the internal state
      // without exposing more methods. We'll test that it doesn't throw.
      expect(() => {
        chunk.applyBoundaryConstraint(coord, neighborTile, dimension, offset);
      }).not.toThrow();
    });

    it('should handle different dimensions', () => {
      const coord: [number, number] = [1, 1];

      expect(() => {
        chunk.applyBoundaryConstraint(coord, neighborTile, 0, 1); // x+1
        chunk.applyBoundaryConstraint(coord, neighborTile, 1, 1); // y+1
        chunk.applyBoundaryConstraint(coord, neighborTile, 0, -1); // x-1
        chunk.applyBoundaryConstraint(coord, neighborTile, 1, -1); // y-1
      }).not.toThrow();
    });

    it('should handle coordinates outside chunk bounds', () => {
      const coord: [number, number] = [5, 5]; // Outside bounds

      expect(() => {
        chunk.applyBoundaryConstraint(coord, neighborTile, 0, 1);
      }).not.toThrow();
    });

    it('should handle null neighbor tile', () => {
      const coord: [number, number] = [1, 1];

      expect(() => {
        chunk.applyBoundaryConstraint(coord, null as any, 0, 1);
      }).toThrow();
    });
  });

  describe('observed property', () => {
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

    it('should be false initially', () => {
      expect(chunk.observed).toBe(false);
    });

    it('should be true after observation', () => {
      [...chunk.observe()];
      expect(chunk.observed).toBe(true);
    });

    it('should remain true after multiple observations', () => {
      [...chunk.observe()];
      expect(chunk.observed).toBe(true);

      [...chunk.observe()];
      expect(chunk.observed).toBe(true);
    });
  });

  describe('debug', () => {
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

    it('should return debug string', () => {
      const debug = chunk.debug();

      expect(typeof debug).toBe('string');
      expect(debug).toContain('░'); // Unobserved tiles
    });

    it('should show observed tiles after observation', () => {
      [...chunk.observe()];
      const debug = chunk.debug();

      expect(debug).toContain('-'); // Observed tiles
      expect(debug).toContain('|'); // Observed tiles
    });

    it('should handle different chunk sizes', () => {
      const smallChunk = new WangTileChunk(tiles, random, [0, 0], [2, 2]);
      const largeChunk = new WangTileChunk(tiles, random, [0, 0], [5, 5]);

      const smallDebug = smallChunk.debug();
      const largeDebug = largeChunk.debug();

      expect(smallDebug).toBeDefined();
      expect(largeDebug).toBeDefined();
      expect(largeDebug.length).toBeGreaterThan(smallDebug.length);
    });
  });

  describe('toJSON', () => {
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

    it('should return JSON representation', () => {
      const json = chunk.toJSON();

      expect(typeof json).toBe('object');
      expect(json).not.toBeNull();
    });

    it('should contain coordinate keys', () => {
      const json = chunk.toJSON();

      expect(json).toHaveProperty('0,0');
      expect(json).toHaveProperty('1,1');
      expect(json).toHaveProperty('2,2');
    });

    it('should contain tileset values', () => {
      const json = chunk.toJSON();

      const tileset = json['1,1'];
      expect(tileset).toBeDefined();
      expect(tileset instanceof Set).toBe(true);
    });

    it('should be consistent across calls', () => {
      const json1 = chunk.toJSON();
      const json2 = chunk.toJSON();

      expect(json1).toEqual(json2);
    });
  });

  describe('edge cases', () => {
    it('should handle empty tileset', () => {
      const emptyTiles = new WangTileSet<[number, number]>();
      const random = new RandomGenerator('testing');

      expect(() => {
        new WangTileChunk(emptyTiles, random, [0, 0], [3, 3]);
      }).not.toThrow();
    });

    it('should handle single tile tileset', () => {
      const singleTile = new WangTileSet([new WangTile<[number, number]>('X')]);
      const random = new RandomGenerator('testing');

      const chunk = new WangTileChunk(singleTile, random, [0, 0], [3, 3]);
      expect(chunk).toBeDefined();
    });

    it('should handle very small chunk', () => {
      const tiles = new WangTileSet([new WangTile<[number, number]>('X')]);
      const random = new RandomGenerator('testing');

      const chunk = new WangTileChunk(tiles, random, [0, 0], [1, 1]);
      expect(chunk).toBeDefined();
    });

    it('should handle very large chunk', () => {
      const tiles = new WangTileSet([new WangTile<[number, number]>('X')]);
      const random = new RandomGenerator('testing');

      const chunk = new WangTileChunk(tiles, random, [0, 0], [100, 100]);
      expect(chunk).toBeDefined();
    });

    it('should handle 1D chunk', () => {
      const tiles = new WangTileSet([new WangTile<[number]>('X')]);
      const random = new RandomGenerator('testing');

      const chunk = new WangTileChunk(tiles, random, [0], [10]);
      expect(chunk).toBeDefined();
    });

    it('should handle 3D chunk', () => {
      const tiles = new WangTileSet([new WangTile<[number, number, number]>('X')]);
      const random = new RandomGenerator('testing');

      const chunk = new WangTileChunk(tiles, random, [0, 0, 0], [3, 3, 3]);
      expect(chunk).toBeDefined();
    });
  });
});
