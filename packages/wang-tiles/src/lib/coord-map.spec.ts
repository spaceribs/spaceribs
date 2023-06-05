import { CoordMap } from './coord-map';

describe('CoordMap', () => {
  let coordMap2D: CoordMap<[number, number], string>;
  let coordMap3D: CoordMap<[number, number, number], string>;
  let coordMap4D: CoordMap<[number, number, number, number], string>;

  beforeEach(() => {
    coordMap2D = new CoordMap();
    coordMap3D = new CoordMap();
    coordMap4D = new CoordMap();
  });

  describe('set() and get()', () => {
    it('can set an element at a coordinate.', () => {
      coordMap2D.set([1, 2], 'foo');
      expect(coordMap2D.get([1, 2])).toBe('foo');
    });
    it('can overwrite an existing element.', () => {
      coordMap2D.set([1, 2], 'foo');
      coordMap2D.set([1, 2], 'bar');
      expect(coordMap2D.get([1, 2])).toBe('bar');
    });
  });

  describe('getNeighbors()', () => {
    it('can get the neighbors of a coordinate.', () => {
      coordMap3D.set([1, 2, 3], 'Origin');
      coordMap3D.set([0, 2, 3], 'xBefore');
      coordMap3D.set([2, 2, 3], 'xAfter');
      coordMap3D.set([1, 1, 3], 'yBefore');
      coordMap3D.set([1, 2, 4], 'zAfter');

      const result = coordMap3D.getNeighbors([1, 2, 3]);
      expect(result).toMatchSnapshot();
    });
  });

  describe('clear()', () => {
    it('can clear all coordinates.', () => {
      coordMap4D.set([1, 2, 3, 4], 'Origin');
      coordMap4D.set([2, 2, 3, 4], 'Test');
      expect(coordMap4D.size).toBe(2);
      coordMap4D.clear();
      expect(coordMap4D.size).toBe(0);
    });
  });

  describe('delete()', () => {
    it('can delete one coordinates.', () => {
      coordMap4D.set([1, 2, 3, 4], 'Origin');
      coordMap4D.set([2, 2, 3, 4], 'Test');
      expect(coordMap4D.size).toBe(2);
      coordMap4D.delete([2, 2, 3, 4]);
      expect(coordMap4D.size).toBe(1);
      expect(coordMap4D.get([2, 2, 3, 4])).toBeUndefined();
    });
  });

  describe('forEach()', () => {
    it('can iterate over all coordinates', () => {
      coordMap4D.set([1, 2, 3, 4], 'Origin');
      coordMap4D.set([2, 2, 3, 4], 'Test');

      const callback = jest.fn();
      coordMap4D.forEach(callback, 'test');

      expect(callback).toBeCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(
        1,
        'Origin',
        [1, 2, 3, 4],
        coordMap4D
      );
      expect(callback).toHaveBeenNthCalledWith(
        2,
        'Test',
        [2, 2, 3, 4],
        coordMap4D
      );
    });
  });

  describe('has()', () => {
    it('can indicate if a coordinate is defined.', () => {
      coordMap2D.set([1, 2], 'Origin');
      coordMap2D.set([2, 2], 'Test');
      const result = coordMap2D.has([1, 2]);

      expect(result).toBe(true);
    });

    it('can indicate if a coordinate is undefined.', () => {
      coordMap2D.set([1, 2], 'Origin');
      coordMap2D.set([2, 2], 'Test');
      const result = coordMap2D.has([1, 1]);

      expect(result).toBe(false);
    });
  });

  describe('entries()', () => {
    it('can iterate returning key/value pairs.', () => {
      coordMap2D.set([1, 2], 'Origin');
      coordMap2D.set([2, 2], 'Test');
      const entries = coordMap2D.entries();
      const result1 = entries.next().value;
      const result2 = entries.next().value;

      expect(result1).toEqual([[1, 2], 'Origin']);
      expect(result2).toEqual([[2, 2], 'Test']);
    });
  });

  describe('keys()', () => {
    it('can iterate returning key/value pairs.', () => {
      coordMap2D.set([1, 2], 'Origin');
      coordMap2D.set([2, 2], 'Test');
      const keys = coordMap2D.keys();
      const result1 = keys.next().value;
      const result2 = keys.next().value;

      expect(result1).toEqual([1, 2]);
      expect(result2).toEqual([2, 2]);
    });
  });

  describe('values()', () => {
    it('can iterate returning key/value pairs.', () => {
      coordMap2D.set([1, 2], 'Origin');
      coordMap2D.set([2, 2], 'Test');
      const values = coordMap2D.values();
      const result1 = values.next().value;
      const result2 = values.next().value;

      expect(result1).toEqual('Origin');
      expect(result2).toEqual('Test');
    });
  });

  describe('fill()', () => {
    it('can fill a 2D grid.', () => {
      coordMap2D.fill((coord) => `${coord[0]} ${coord[1]}`, [0, 0], [16, 16]);
      expect(coordMap2D).toMatchSnapshot();
    });

    it('can fill a 3D cube.', () => {
      coordMap3D.fill(
        (coord) => `${coord[0]} ${coord[1]} ${coord[2]}`,
        [0, 0, 0],
        [2, 2, 2]
      );
      expect(coordMap3D).toMatchInlineSnapshot(`
        Object {
          "0,0,0": "0 0 0",
          "0,0,1": "0 0 1",
          "0,1,0": "0 1 0",
          "0,1,1": "0 1 1",
          "1,0,0": "1 0 0",
          "1,0,1": "1 0 1",
          "1,1,0": "1 1 0",
          "1,1,1": "1 1 1",
        }
      `);
    });
  });

  describe('IterableIterator', () => {
    it('can get the neighbors of a coordinate.', () => {
      coordMap3D.set([1, 2, 3], 'Origin');
      coordMap3D.set([2, 2, 3], 'xBefore');
      coordMap3D.set([3, 2, 3], 'xAfter');

      expect([...coordMap3D]).toMatchSnapshot();
    });
  });

  describe('toJSON()', () => {
    it('can return a JSON serialized version.', () => {
      coordMap2D.set([1, 2], 'Origin');
      coordMap2D.set([2, 2], 'Test');
      const result = JSON.stringify(coordMap2D);
      expect(result).toMatchInlineSnapshot(
        `"{\\"1,2\\":\\"Origin\\",\\"2,2\\":\\"Test\\"}"`
      );
    });
  });
});
