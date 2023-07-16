import { WangTileChunk } from './chunk';
import { Edge } from './edge';
import { RandomGenerator } from './prng';
import { WangTile } from './tile';
import { WangTileSet } from './tile-set';
import { asciiDebug } from './util/ascii-debug';

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
      expect(result).toMatchInlineSnapshot(`
        Array [
          Array [
            2,
            5,
          ],
          WangTile {
            "data": "-",
            "edges": Object {},
            "probability": 1,
          },
        ]
      `);
      expect(asciiDebug(chunk)).toMatchInlineSnapshot(`
        "
        ░░░░░
        ░░░░░
        ░░░░░
        ░░░░░
        ░░-░░
        ░░░░░
        ░░░░░
        ░░░░░
        ░░░░░
        ░░░░░
        "
      `);
    });

    it('should observe all the tiles.', () => {
      const results = [...chunk.observe()];
      expect(asciiDebug(chunk)).toMatchInlineSnapshot(`
        "
        ---|-
        ||-||
        -----
        ||-||
        ---|-
        -----
        -|-|-
        |-|--
        |||--
        |----
        "
      `);
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

      const results = [...chunk.observe()];

      expect(asciiDebug(chunk)).toMatchInlineSnapshot(`
        "
        -= -= -= -
        -= -= -= -
        = -= -= -=
        -= -= -= -
        -= -= -= -
        "
      `);
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

      const results = [...chunk.observe()];

      expect(asciiDebug(chunk)).toMatchInlineSnapshot(`
        "
           ║ ║     ╚══╗║  ╚╝    
           ║╔╝        ║║     ╔══
           ╚╝   ╔══╗  ╚╝ ╔══╗║  
          ╔╗    ╚══╝     ║  ╚╝  
         ╔╝║             ╚═══╗  
         ╚═╝╔═╗   ╔╗    ╔══╗ ║  
        ╗   ║ ║   ╚╝    ╚══╝ ╚╗ 
        ║ ╔═╝╔╝ ╔══╗          ║ 
        ║ ║  ║  ╚╗ ║          ╚═
        ║ ╚══╝╔══╝ ║   ╔╗       
        ╝    ╔╝  ╔═╝   ╚╝╔╗     
             ║   ╚══╗╔╗  ╚╝╔═╗  
        ╗    ║      ╚╝║  ╔╗║ ╚╗ 
        ╝    ╚═╗    ╔╗╚╗ ╚╝║ ╔╝ 
               ║    ║╚═╝   ║ ║  
              ╔╝    ╚══╗   ║ ╚╗ 
         ╔╗   ╚╗      ╔╝   ╚╗ ╚═
        ╗║║    ╚╗ ╔══╗║     ╚╗╔╗
        ╝║║    ╔╝ ║  ╚╝      ║║╚
         ║╚═╗  ║  ║          ╚╝ 
         ╚╗ ╚══╝╔╗╚╗            
          ╚═╗   ║╚╗║ ╔╗ ╔╗   ╔══
        ╗   ╚═╗╔╝╔╝║ ╚╝ ╚╝   ╚╗ 
        ╚═╗   ║║╔╝ ║╔╗ ╔═══╗ ╔╝ 
        "
      `);
      expect(chunk.observed).toBe(true);
    });
  });
});
