import { WangTileSet } from './tile-set';
import { WangTile } from './tile';

describe('WangTileSet', () => {
  describe('constructor', () => {
    it('should create an empty tileset', () => {
      const tileset = new WangTileSet();
      expect(tileset.size).toBe(0);
    });

    it('should create a tileset with initial tiles', () => {
      const tile1 = new WangTile('tile1');
      const tile2 = new WangTile('tile2');
      const tileset = new WangTileSet([tile1, tile2]);

      expect(tileset.size).toBe(2);
      expect(tileset.has(tile1)).toBe(true);
      expect(tileset.has(tile2)).toBe(true);
    });

    it('should handle multi-dimensional tilesets', () => {
      const tile2D = new WangTile<[number, number]>('2d-tile');
      const tile3D = new WangTile<[number, number, number]>('3d-tile');

      const tileset2D = new WangTileSet<[number, number]>([tile2D]);
      const tileset3D = new WangTileSet<[number, number, number]>([tile3D]);

      expect(tileset2D.size).toBe(1);
      expect(tileset3D.size).toBe(1);
    });

    it('should handle typed tilesets', () => {
      const stringTile = new WangTile<[number, number], string>('string-tile');
      const numberTile = new WangTile<[number, number], number>(42);

      const stringTileset = new WangTileSet<[number, number], string>([stringTile]);
      const numberTileset = new WangTileSet<[number, number], number>([numberTile]);

      expect(stringTileset.size).toBe(1);
      expect(numberTileset.size).toBe(1);
    });
  });

  describe('reduceByConstraint', () => {
    let tileset: WangTileSet<[number, number]>;
    let tile1: WangTile<[number, number]>;
    let tile2: WangTile<[number, number]>;
    let tile3: WangTile<[number, number]>;

    beforeEach(() => {
      tile1 = new WangTile<[number, number]>('tile1');
      tile2 = new WangTile<[number, number]>('tile2');
      tile3 = new WangTile<[number, number]>('tile3');

      // Add constraints to tiles
      tile1.addConstraint({ coords: [1, 0], edge: 'wall' });
      tile1.addConstraint({ coords: [0, 1], edge: 'floor' });

      tile2.addConstraint({ coords: [1, 0], edge: 'wall' });
      tile2.addConstraint({ coords: [0, 1], edge: 'wall' });

      tile3.addConstraint({ coords: [1, 0], edge: 'floor' });
      tile3.addConstraint({ coords: [0, 1], edge: 'floor' });

      tileset = new WangTileSet([tile1, tile2, tile3]);
    });

    it('should reduce tileset by single constraint', () => {
      const reduced = tileset.reduceByConstraint('wall', [1, 0]);

      expect(reduced.size).toBe(2);
      expect(reduced.has(tile1)).toBe(true);
      expect(reduced.has(tile2)).toBe(true);
      expect(reduced.has(tile3)).toBe(false);
    });

    it('should return empty tileset when no tiles match constraint', () => {
      const reduced = tileset.reduceByConstraint('door', [1, 0]);

      expect(reduced.size).toBe(0);
    });

    it('should return all tiles when all match constraint', () => {
      const reduced = tileset.reduceByConstraint('wall', [1, 0]);

      expect(reduced.size).toBe(2);
    });

    it('should handle symbol edges', () => {
      const symbolEdge = Symbol('wall');
      tile1.addConstraint({ coords: [1, 0], edge: symbolEdge });

      const reduced = tileset.reduceByConstraint(symbolEdge, [1, 0]);

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1)).toBe(true);
    });

    it('should handle 3D constraints', () => {
      const tileset3D = new WangTileSet<[number, number, number]>();
      const tile3D = new WangTile<[number, number, number]>('3d-tile');
      tile3D.addConstraint({ coords: [1, 0, 2], edge: 'wall' });
      tileset3D.add(tile3D);

      const reduced = tileset3D.reduceByConstraint('wall', [1, 0, 2]);

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile3D)).toBe(true);
    });

    it('should handle 1D constraints', () => {
      const tileset1D = new WangTileSet<[number]>();
      const tile1D = new WangTile<[number]>('1d-tile');
      tile1D.addConstraint({ coords: [1], edge: 'wall' });
      tileset1D.add(tile1D);

      const reduced = tileset1D.reduceByConstraint('wall', [1]);

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1D)).toBe(true);
    });

    it('should return new tileset instance', () => {
      const reduced = tileset.reduceByConstraint('wall', [1, 0]);

      expect(reduced).not.toBe(tileset);
      expect(reduced instanceof WangTileSet).toBe(true);
    });

    it('should not modify original tileset', () => {
      const originalSize = tileset.size;
      tileset.reduceByConstraint('wall', [1, 0]);

      expect(tileset.size).toBe(originalSize);
    });
  });

  describe('reduceByConstraints', () => {
    let tileset: WangTileSet<[number, number]>;
    let tile1: WangTile<[number, number]>;
    let tile2: WangTile<[number, number]>;
    let tile3: WangTile<[number, number]>;

    beforeEach(() => {
      tile1 = new WangTile<[number, number]>('tile1');
      tile2 = new WangTile<[number, number]>('tile2');
      tile3 = new WangTile<[number, number]>('tile3');

      // Add constraints to tiles
      tile1.addConstraint({ coords: [1, 0], edge: 'wall' });
      tile2.addConstraint({ coords: [1, 0], edge: 'floor' });
      tile3.addConstraint({ coords: [1, 0], edge: 'door' });

      tileset = new WangTileSet([tile1, tile2, tile3]);
    });

    it('should reduce tileset by multiple constraints', () => {
      const reduced = tileset.reduceByConstraints(['wall', 'floor'], [1, 0]);

      expect(reduced.size).toBe(2);
      expect(reduced.has(tile1)).toBe(true);
      expect(reduced.has(tile2)).toBe(true);
      expect(reduced.has(tile3)).toBe(false);
    });

    it('should handle empty constraints array', () => {
      const reduced = tileset.reduceByConstraints([], [1, 0]);

      expect(reduced.size).toBe(0);
    });

    it('should handle single constraint in array', () => {
      const reduced = tileset.reduceByConstraints(['wall'], [1, 0]);

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1)).toBe(true);
    });

    it('should handle duplicate constraints', () => {
      const reduced = tileset.reduceByConstraints(['wall', 'wall'], [1, 0]);

      expect(reduced.size).toBe(1); // tile1 appears once (Set removes duplicates)
      expect(reduced.has(tile1)).toBe(true);
    });

    it('should handle mixed edge types', () => {
      const symbolEdge = Symbol('wall');
      tile1.addConstraint({ coords: [1, 0], edge: symbolEdge });

      const reduced = tileset.reduceByConstraints(['floor', symbolEdge], [1, 0]);

      expect(reduced.size).toBe(2);
      expect(reduced.has(tile1)).toBe(true);
      expect(reduced.has(tile2)).toBe(true);
    });

    it('should return new tileset instance', () => {
      const reduced = tileset.reduceByConstraints(['wall', 'floor'], [1, 0]);

      expect(reduced).not.toBe(tileset);
      expect(reduced instanceof WangTileSet).toBe(true);
    });

    it('should not modify original tileset', () => {
      const originalSize = tileset.size;
      tileset.reduceByConstraints(['wall', 'floor'], [1, 0]);

      expect(tileset.size).toBe(originalSize);
    });
  });

  describe('reduceOffset', () => {
    let tileset: WangTileSet<[number, number]>;
    let tile1: WangTile<[number, number]>;
    let tile2: WangTile<[number, number]>;
    let tile3: WangTile<[number, number]>;

    beforeEach(() => {
      tile1 = new WangTile<[number, number]>('tile1');
      tile2 = new WangTile<[number, number]>('tile2');
      tile3 = new WangTile<[number, number]>('tile3');

      // Add constraints to tiles at specific offsets
      tile1.addConstraint({ coords: [1, 0], edge: 'wall' }); // x+1
      tile2.addConstraint({ coords: [-1, 0], edge: 'floor' }); // x-1
      tile3.addConstraint({ coords: [0, 1], edge: 'door' }); // y+1

      tileset = new WangTileSet([tile1, tile2, tile3]);
    });

    it('should reduce by single edge offset', () => {
      const reduced = tileset.reduceOffset('wall', 2, 0, 1); // x+1

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1)).toBe(true);
    });

    it('should reduce by negative offset', () => {
      const reduced = tileset.reduceOffset('floor', 2, 0, -1); // x-1

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile2)).toBe(true);
    });

    it('should reduce by different dimension', () => {
      const reduced = tileset.reduceOffset('door', 2, 1, 1); // y+1

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile3)).toBe(true);
    });

    it('should reduce by multiple edge offsets', () => {
      const reduced = tileset.reduceOffset(['wall', 'floor'], 2, 0, 1);

      expect(reduced.size).toBe(1); // Only tile1 matches x+1 constraint
      expect(reduced.has(tile1)).toBe(true);
      expect(reduced.has(tile2)).toBe(false); // tile2 has x-1, not x+1
    });

    it('should handle 3D offsets', () => {
      const tileset3D = new WangTileSet<[number, number, number]>();
      const tile3D = new WangTile<[number, number, number]>('3d-tile');
      tile3D.addConstraint({ coords: [0, 0, 1], edge: 'wall' }); // z+1
      tileset3D.add(tile3D);

      const reduced = tileset3D.reduceOffset('wall', 3, 2, 1); // z+1

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile3D)).toBe(true);
    });

    it('should handle 1D offsets', () => {
      const tileset1D = new WangTileSet<[number]>();
      const tile1D = new WangTile<[number]>('1d-tile');
      tile1D.addConstraint({ coords: [1], edge: 'wall' }); // +1
      tileset1D.add(tile1D);

      const reduced = tileset1D.reduceOffset('wall', 1, 0, 1); // +1

      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1D)).toBe(true);
    });

    it('should return empty tileset when no tiles match offset', () => {
      const reduced = tileset.reduceOffset('nonexistent', 2, 0, 1);

      expect(reduced.size).toBe(0);
    });

    it('should return new tileset instance', () => {
      const reduced = tileset.reduceOffset('wall', 2, 0, 1);

      expect(reduced).not.toBe(tileset);
      expect(reduced instanceof WangTileSet).toBe(true);
    });

    it('should not modify original tileset', () => {
      const originalSize = tileset.size;
      tileset.reduceOffset('wall', 2, 0, 1);

      expect(tileset.size).toBe(originalSize);
    });

    it('should handle edge cases with dimensions', () => {
      // Test with dimension 0 (x-axis)
      const reducedX = tileset.reduceOffset('wall', 2, 0, 1);
      expect(reducedX.size).toBe(1);

      // Test with dimension 1 (y-axis)
      const reducedY = tileset.reduceOffset('door', 2, 1, 1);
      expect(reducedY.size).toBe(1);
    });
  });

  describe('Set inheritance', () => {
    let tileset: WangTileSet<[number, number]>;

    beforeEach(() => {
      tileset = new WangTileSet<[number, number]>();
    });

    it('should support Set methods', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');

      tileset.add(tile1);
      tileset.add(tile2);

      expect(tileset.size).toBe(2);
      expect(tileset.has(tile1)).toBe(true);
      expect(tileset.has(tile2)).toBe(true);

      tileset.delete(tile1);
      expect(tileset.size).toBe(1);
      expect(tileset.has(tile1)).toBe(false);

      tileset.clear();
      expect(tileset.size).toBe(0);
    });

    it('should support iteration', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');

      tileset.add(tile1);
      tileset.add(tile2);

      const tiles = Array.from(tileset);
      expect(tiles).toHaveLength(2);
      expect(tiles).toContain(tile1);
      expect(tiles).toContain(tile2);
    });

    it('should support forEach', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');

      tileset.add(tile1);
      tileset.add(tile2);

      const tiles: WangTile<[number, number]>[] = [];
      tileset.forEach(tile => tiles.push(tile));

      expect(tiles).toHaveLength(2);
      expect(tiles).toContain(tile1);
      expect(tiles).toContain(tile2);
    });

    it('should support entries iteration', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');

      tileset.add(tile1);
      tileset.add(tile2);

      const entries = Array.from(tileset.entries());
      expect(entries).toHaveLength(2);
      expect(entries[0][0]).toBe(entries[0][1]); // Set entries are [value, value]
    });

    it('should support values iteration', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');

      tileset.add(tile1);
      tileset.add(tile2);

      const values = Array.from(tileset.values());
      expect(values).toHaveLength(2);
      expect(values).toContain(tile1);
      expect(values).toContain(tile2);
    });

    it('should support keys iteration', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');

      tileset.add(tile1);
      tileset.add(tile2);

      const keys = Array.from(tileset.keys());
      expect(keys).toHaveLength(2);
      expect(keys).toContain(tile1);
      expect(keys).toContain(tile2);
    });
  });

  describe('edge cases', () => {
    it('should handle tileset with duplicate tiles', () => {
      const tile = new WangTile<[number, number]>('tile');
      const tileset = new WangTileSet([tile, tile]); // Same tile twice

      expect(tileset.size).toBe(1); // Set removes duplicates
    });

    it('should handle tileset with tiles that have no constraints', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');
      tile1.addConstraint({ coords: [1, 0], edge: 'wall' });
      // tile2 has no constraints

      const tileset = new WangTileSet([tile1, tile2]);

      const reduced = tileset.reduceByConstraint('wall', [1, 0]);
      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1)).toBe(true);
      expect(reduced.has(tile2)).toBe(false);
    });

    it('should handle tileset with tiles that have constraints at different coordinates', () => {
      const tile1 = new WangTile<[number, number]>('tile1');
      const tile2 = new WangTile<[number, number]>('tile2');
      tile1.addConstraint({ coords: [1, 0], edge: 'wall' });
      tile2.addConstraint({ coords: [0, 1], edge: 'wall' });

      const tileset = new WangTileSet([tile1, tile2]);

      const reduced = tileset.reduceByConstraint('wall', [1, 0]);
      expect(reduced.size).toBe(1);
      expect(reduced.has(tile1)).toBe(true);
      expect(reduced.has(tile2)).toBe(false);
    });
  });
});
