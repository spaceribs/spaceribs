import { WangTileSet } from './tile-set';
import { WangTile } from './tile';
import { WangTileWorld } from './world';

/**
 * Repro for cross-chunk boundary constraint failure seen in the demo:
 * Seed "demo-seedads", generate (1,1) then (1,0) then (0,0).
 */
describe('World cross-chunk boundary constraints (repro)', () => {
  it('does not collapse to empty when generating (1,1) -> (1,0) -> (0,0)', () => {
    // Build the same 2D tileset used in the demo: Wall(█), Floor(·), Door(░)
    const wall = new WangTile<[number, number]>('█', 0.4);
    // solid on all four sides
    wall.edges.set([0, 1], 'solid');
    wall.edges.set([0, -1], 'solid');
    wall.edges.set([1, 0], 'solid');
    wall.edges.set([-1, 0], 'solid');

    const floor = new WangTile<[number, number]>('·', 0.5);
    // open on all four sides
    floor.edges.set([0, 1], 'open');
    floor.edges.set([0, -1], 'open');
    floor.edges.set([1, 0], 'open');
    floor.edges.set([-1, 0], 'open');

    const door = new WangTile<[number, number]>('░', 0.1);
    // solid vertically, open horizontally (like a door in a wall)
    door.edges.set([0, 1], 'solid');
    door.edges.set([0, -1], 'solid');
    door.edges.set([1, 0], 'open');
    door.edges.set([-1, 0], 'open');

    const tiles = new WangTileSet<[number, number]>([wall, floor, door]);

    // World is 3x3 grid of chunks; chunk size 10x10 to mirror demo defaults
    const world = new WangTileWorld<[number, number], [number, number]>(
      tiles,
      [0, 0],
      [3, 3],
      [0, 0],
      [10, 10],
      'demo-seedads',
    );

    // Generate center chunk first
    expect(() => world.observeChunk([1, 1])).not.toThrow();

    // Then right neighbor
    expect(() => world.observeChunk([1, 0])).not.toThrow();

    // Then left neighbor of the center
    expect(() => world.observeChunk([0, 0])).not.toThrow();

    // Sanity: all three chunks exist and contain cells
    const c11 = world.getChunk([1, 1]);
    const c10 = world.getChunk([1, 0]);
    const c00 = world.getChunk([0, 0]);
    expect(c11).toBeDefined();
    expect(c10).toBeDefined();
    expect(c00).toBeDefined();
    if (!c11 || !c10 || !c00) {
      throw new Error('Chunks should be defined');
    }
    const json11 = c11.toJSON();
    const json10 = c10.toJSON();
    const json00 = c00.toJSON();
    expect(Object.keys(json11).length).toBe(100);
    expect(Object.keys(json10).length).toBe(100);
    expect(Object.keys(json00).length).toBe(100);
  });
});


