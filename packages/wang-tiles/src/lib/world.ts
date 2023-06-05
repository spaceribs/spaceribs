import { WangTileSet } from './tile-set';
import { CoordMap } from './coord-map';
import { WangTileChunk } from './chunk';
import { RandomGenerator } from './prng';

/**
 * A wang tile world to initialize.
 */
export class WangTileWorld<
  WorldDimensions extends number[],
  ChunkDimensions extends number[],
  DataType = unknown
> {
  private readonly chunkMap: CoordMap<
    WorldDimensions,
    WangTileChunk<ChunkDimensions, WangTileSet<ChunkDimensions, DataType>>
  >;
  private readonly random: RandomGenerator;

  constructor(
    private readonly tileset: WangTileSet<ChunkDimensions, DataType>,
    private readonly worldStart: WorldDimensions,
    private readonly worldEnd: WorldDimensions,
    private readonly chunkStart: ChunkDimensions,
    private readonly chunkEnd: ChunkDimensions,
    seed = 'default seed'
  ) {
    this.random = new RandomGenerator(seed);
    this.chunkMap = new CoordMap<
      WorldDimensions,
      WangTileChunk<ChunkDimensions, WangTileSet<ChunkDimensions, DataType>>
    >().fill(
      () => new WangTileChunk(tileset, this.random, chunkStart, chunkEnd),
      worldStart,
      worldEnd
    );
  }

  /**
   * Convert world map to a simple nested object for storage and testing.
   * @returns An object representing all coordinates in the map. Keys are comma delineated coordinates.
   */
  toJSON(): Record<
    string,
    WangTileChunk<ChunkDimensions, WangTileSet<ChunkDimensions, DataType>>
  > {
    return this.chunkMap.toJSON();
  }
}
