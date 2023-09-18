import { WangTileSet } from './tile-set';
import { WangTileWorld } from './world';

describe('WangTileWorld', () => {
  it('should work', () => {
    const world = new WangTileWorld(
      new WangTileSet([]),
      [-1, -1],
      [2, 2],
      [0, 0],
      [16, 16],
    );
    expect(world).toBeDefined();
  });
});
