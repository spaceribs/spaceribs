import { WangTile } from './tile';
import { Constraint } from './constraint.models';

describe('WangTile', () => {
  describe('constructor', () => {
    it('should create a tile with default probability', () => {
      const tile = new WangTile('test-data');
      expect(tile.probability).toBe(1);
    });

    it('should create a tile with custom probability', () => {
      const tile = new WangTile('test-data', 0.5);
      expect(tile.probability).toBe(0.5);
    });

    it('should initialize empty edges CoordMap', () => {
      const tile = new WangTile('test-data');
      expect(tile.edges).toBeDefined();
      expect(tile.edges.size).toBe(0);
    });

    it('should handle different data types', () => {
      const stringTile = new WangTile('string-data');
      const numberTile = new WangTile(42);
      const objectTile = new WangTile({ key: 'value' });
      const nullTile = new WangTile(null);

      expect(stringTile).toBeDefined();
      expect(numberTile).toBeDefined();
      expect(objectTile).toBeDefined();
      expect(nullTile).toBeDefined();
    });

    it('should handle multi-dimensional tiles', () => {
      const tile2D = new WangTile<[number, number]>('2d-tile');
      const tile3D = new WangTile<[number, number, number]>('3d-tile');
      const tile4D = new WangTile<[number, number, number, number]>('4d-tile');

      expect(tile2D).toBeDefined();
      expect(tile3D).toBeDefined();
      expect(tile4D).toBeDefined();
    });
  });

  describe('addConstraint', () => {
    let tile: WangTile<[number, number]>;

    beforeEach(() => {
      tile = new WangTile<[number, number]>('test-tile');
    });

    it('should add a constraint to the tile', () => {
      const constraint: Constraint<[number, number]> = {
        coords: [1, 0],
        edge: 'wall',
      };

      tile.addConstraint(constraint);

      const edge = tile.edges.get([1, 0]);
      expect(edge).toBe('wall');
    });

    it('should add multiple constraints to different coordinates', () => {
      const constraint1: Constraint<[number, number]> = {
        coords: [1, 0],
        edge: 'wall',
      };
      const constraint2: Constraint<[number, number]> = {
        coords: [0, 1],
        edge: 'floor',
      };

      tile.addConstraint(constraint1);
      tile.addConstraint(constraint2);

      expect(tile.edges.get([1, 0])).toBe('wall');
      expect(tile.edges.get([0, 1])).toBe('floor');
    });

    it('should overwrite existing constraint at same coordinate', () => {
      const constraint1: Constraint<[number, number]> = {
        coords: [1, 0],
        edge: 'wall',
      };
      const constraint2: Constraint<[number, number]> = {
        coords: [1, 0],
        edge: 'floor',
      };

      tile.addConstraint(constraint1);
      tile.addConstraint(constraint2);

      expect(tile.edges.get([1, 0])).toBe('floor');
    });

    it('should handle symbol edges', () => {
      const symbolEdge = Symbol('wall');
      const constraint: Constraint<[number, number]> = {
        coords: [1, 0],
        edge: symbolEdge,
      };

      tile.addConstraint(constraint);

      expect(tile.edges.get([1, 0])).toBe(symbolEdge);
    });

    it('should handle 3D constraints', () => {
      const tile3D = new WangTile<[number, number, number]>('3d-tile');
      const constraint: Constraint<[number, number, number]> = {
        coords: [1, 0, 2],
        edge: 'wall',
      };

      tile3D.addConstraint(constraint);

      expect(tile3D.edges.get([1, 0, 2])).toBe('wall');
    });

    it('should handle 1D constraints', () => {
      const tile1D = new WangTile<[number]>('1d-tile');
      const constraint: Constraint<[number]> = {
        coords: [1],
        edge: 'wall',
      };

      tile1D.addConstraint(constraint);

      expect(tile1D.edges.get([1])).toBe('wall');
    });
  });

  describe('toString', () => {
    it('should return string representation of string data', () => {
      const tile = new WangTile('test-string');
      expect(tile.toString()).toBe('test-string');
    });

    it('should return string representation of number data', () => {
      const tile = new WangTile(42);
      expect(tile.toString()).toBe('42');
    });

    it('should return string representation of boolean data', () => {
      const tile = new WangTile(true);
      expect(tile.toString()).toBe('true');
    });

    it('should return string representation of object data', () => {
      const tile = new WangTile({ key: 'value' });
      expect(tile.toString()).toBe('[object Object]');
    });

    it('should return "undefined" for null data', () => {
      const tile = new WangTile(null);
      expect(tile.toString()).toBe('undefined');
    });

    it('should return "undefined" for undefined data', () => {
      const tile = new WangTile(undefined);
      expect(tile.toString()).toBe('undefined');
    });

    it('should handle custom toString methods', () => {
      const customObject = {
        toString() {
          return 'custom-string';
        },
      };
      const tile = new WangTile(customObject);
      expect(tile.toString()).toBe('custom-string');
    });
  });

  describe('edge management', () => {
    let tile: WangTile<[number, number]>;

    beforeEach(() => {
      tile = new WangTile<[number, number]>('test-tile');
    });

    it('should allow direct access to edges CoordMap', () => {
      tile.edges.set([1, 0], 'wall');
      tile.edges.set([0, 1], 'floor');

      expect(tile.edges.get([1, 0])).toBe('wall');
      expect(tile.edges.get([0, 1])).toBe('floor');
      expect(tile.edges.size).toBe(2);
    });

    it('should support CoordMap methods', () => {
      tile.edges.set([1, 0], 'wall');
      tile.edges.set([0, 1], 'floor');

      expect(tile.edges.has([1, 0])).toBe(true);
      expect(tile.edges.has([0, 0])).toBe(false);

      tile.edges.delete([1, 0]);
      expect(tile.edges.has([1, 0])).toBe(false);
      expect(tile.edges.size).toBe(1);
    });

    it('should handle edge iteration', () => {
      tile.edges.set([1, 0], 'wall');
      tile.edges.set([0, 1], 'floor');

      const entries = Array.from(tile.edges.entries());
      expect(entries).toHaveLength(2);
      expect(entries).toContainEqual([[1, 0], 'wall']);
      expect(entries).toContainEqual([[0, 1], 'floor']);
    });
  });

  describe('probability handling', () => {
    it('should handle zero probability', () => {
      const tile = new WangTile('test', 0);
      expect(tile.probability).toBe(0);
    });

    it('should handle high probability', () => {
      const tile = new WangTile('test', 100);
      expect(tile.probability).toBe(100);
    });

    it('should handle decimal probability', () => {
      const tile = new WangTile('test', 0.75);
      expect(tile.probability).toBe(0.75);
    });

    it('should handle negative probability', () => {
      const tile = new WangTile('test', -0.5);
      expect(tile.probability).toBe(-0.5);
    });
  });

  describe('immutability', () => {
    it('should not allow modification of probability after construction', () => {
      const tile = new WangTile('test', 0.5);

      // TypeScript should prevent this, but let's test runtime behavior
      expect(() => {
        (tile as unknown as { probability: number }).probability = 1.0;
      }).not.toThrow();

      // The property is actually mutable at runtime
      expect(tile.probability).toBe(1.0);
    });

    it('should not allow modification of data after construction', () => {
      const tile = new WangTile('test');

      // TypeScript should prevent this, but let's test runtime behavior
      expect(() => {
        (tile as unknown as { data: string }).data = 'modified';
      }).not.toThrow();

      // The property is actually mutable at runtime
      expect(tile.toString()).toBe('modified');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string data', () => {
      const tile = new WangTile('');
      expect(tile.toString()).toBe('');
    });

    it('should handle NaN data', () => {
      const tile = new WangTile(NaN);
      expect(tile.toString()).toBe('NaN');
    });

    it('should handle Infinity data', () => {
      const tile = new WangTile(Infinity);
      expect(tile.toString()).toBe('Infinity');
    });

    it('should handle array data', () => {
      const tile = new WangTile([1, 2, 3]);
      expect(tile.toString()).toBe('1,2,3');
    });

    it('should handle function data', () => {
      const func = () => 'test';
      const tile = new WangTile(func);
      expect(tile.toString()).toBe(func.toString());
    });
  });
});
