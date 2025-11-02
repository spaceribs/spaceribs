import { WangTileSet } from './tile-set';
import { CoordMap } from './coord-map';
import { WangTileChunk } from './chunk';
import { RandomGenerator } from './prng';
import { WangTile } from './tile';

/**
 * A wang tile world to initialize.
 */
export class WangTileWorld<
  WorldDimensions extends number[],
  ChunkDimensions extends number[],
  DataType = unknown,
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
    seed = 'default seed',
  ) {
    this.random = new RandomGenerator(seed);
    this.chunkMap = new CoordMap<
      WorldDimensions,
      WangTileChunk<ChunkDimensions, WangTileSet<ChunkDimensions, DataType>>
    >().fill(
      (coord) => {
        // Create a chunk-specific seed that incorporates the base seed and chunk coordinates
        const chunkSeed = `${seed}-chunk-${coord.join('-')}`;
        const chunkRandom = new RandomGenerator(chunkSeed);
        return new WangTileChunk(tileset, chunkRandom, chunkStart, chunkEnd);
      },
      worldStart,
      worldEnd,
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

  /**
   * Get a specific chunk by its world coordinates.
   * @param coord - The world coordinate of the chunk
   * @returns The chunk at the specified coordinate or undefined
   */
  public getChunk(coord: WorldDimensions):
    | WangTileChunk<ChunkDimensions, WangTileSet<ChunkDimensions, DataType>>
    | undefined {
    return this.chunkMap.get(coord);
  }

  /**
   * Observe a chunk at world coordinates, applying boundary constraints from already
   * generated adjacent chunks before observation.
   * @param coord - The world coordinate of the chunk to observe
   */
  public observeChunk(coord: WorldDimensions): void {
    const chunk = this.getChunk(coord);
    // If chunk not found, throw per existing tests
    if (typeof chunk === 'undefined' || chunk === null) {
      throw new Error(`Chunk at coordinate ${coord.join(',')} not found`);
    }

    // Apply constraints from any already-generated neighbors
    this.applyBoundaryConstraintsFromNeighbors(coord);

    // Observe until completion
    for (const result of chunk.observe()) {
      // Iterator consumed for side effects
      void result; // Explicitly mark as intentionally unused
    }
  }

  /**
   * Apply boundary constraints to the target chunk based on any adjacent chunks
   * that have already generated tiles along shared edges.
   * Supports any number of dimensions.
   * @param coord - World coordinate of the target chunk
   */
  public applyBoundaryConstraintsFromNeighbors(coord: WorldDimensions): void {
    const target = this.getChunk(coord);
    if (target === null || target === undefined) {
      return;
    }

    const dims = this.chunkStart.length;
    if (dims < 1) {return;}

    const size: number[] = this.chunkEnd.map((val, idx) => val - this.chunkStart[idx]);
    

    // Helper to get neighbor chunk if it exists
    const getNeighbor = (dimension: number, offset: -1 | 1): WangTileChunk<ChunkDimensions, WangTileSet<ChunkDimensions, DataType>> | null => {
      const neighborCoord = [...coord] as WorldDimensions;
      neighborCoord[dimension] += offset;
      const neighbor = this.getChunk(neighborCoord) ?? null;
      return neighbor;
    };

    // Iterate through all dimensions
    for (let dimension = 0; dimension < dims; dimension++) {
      
      
      // Calculate the orthogonal dimensions (all dimensions except the current one)
      const orthogonalDims = size.filter((_, idx) => idx !== dimension);
      const totalOrthogonalCells = orthogonalDims.reduce((acc, dimSize) => acc * dimSize, 1);
      

      // BEFORE neighbor (offset -1)
      const before = getNeighbor(dimension, -1);
      if (before !== null) {
        const beforeJSON = before.toJSON();

        // Iterate through all orthogonal positions
        for (let orthIndex = 0; orthIndex < totalOrthogonalCells; orthIndex++) {
          const neighborLocal = this.getOrthogonalCoordinate(orthIndex, dimension, size);
          // Use the neighbor's border cell that touches this chunk (rightmost for BEFORE)
          neighborLocal[dimension] = size[dimension] - 1;
          const neighborKey = neighborLocal.join(',');
          const neighborVal = beforeJSON[neighborKey];

          if (neighborVal instanceof WangTile && target !== null) {
            const local = this.getTargetCoordinate(neighborLocal, dimension, size, -1);
            // Neighbor is BEFORE (-1), so we apply constraint with offset -1 (towards neighbor)
            target.applyBoundaryConstraint(
              local as unknown as ChunkDimensions,
              neighborVal as unknown as WangTile<ChunkDimensions>,
              dimension,
              -1,
            );
          }
        }
      }

      // AFTER neighbor (offset +1)
      const after = getNeighbor(dimension, 1);
      if (after !== null) {
        const afterJSON = after.toJSON();

        // Iterate through all orthogonal positions
        for (let orthIndex = 0; orthIndex < totalOrthogonalCells; orthIndex++) {
          const neighborLocal = this.getOrthogonalCoordinate(orthIndex, dimension, size);
          // Use the neighbor's border cell that touches this chunk (leftmost for AFTER)
          neighborLocal[dimension] = 0;
          const neighborKey = neighborLocal.join(',');
          const neighborVal = afterJSON[neighborKey];

          if (neighborVal instanceof WangTile && target !== null) {
            const local = this.getTargetCoordinate(neighborLocal, dimension, size, 1);
            // Neighbor is AFTER (+1), so we apply constraint with offset +1 (towards neighbor)
            target.applyBoundaryConstraint(
              local as unknown as ChunkDimensions,
              neighborVal as unknown as WangTile<ChunkDimensions>,
              dimension,
              1,
            );
          }
        }
      }
    }
    
  }

  /**
   * Convert an orthogonal index to a coordinate array for the given dimension.
   * @param orthIndex - The orthogonal index (0 to totalOrthogonalCells-1)
   * @param dimension - The dimension we're working along
   * @param size - The size array for all dimensions
   * @returns The coordinate array
   */
  private getOrthogonalCoordinate(orthIndex: number, dimension: number, size: number[]): number[] {
    const coord = [...size];
    coord[dimension] = 0; // Will be set based on neighbor direction

    // Convert orthIndex to coordinates in orthogonal dimensions
    let remaining = orthIndex;
    for (let i = size.length - 1; i >= 0; i--) {
      if (i === dimension) {continue;}
      coord[i] = remaining % size[i];
      remaining = Math.floor(remaining / size[i]);
    }

    return coord;
  }

  /**
   * Get the target coordinate in the current chunk based on neighbor coordinate and direction.
   * @param neighborCoord - The coordinate in the neighbor chunk
   * @param dimension - The dimension we're working along
   * @param size - The size array for all dimensions
   * @param neighborDirection - The direction of the neighbor (-1 for before, +1 for after)
   * @returns The coordinate in the target chunk
   */
  private getTargetCoordinate(
    neighborCoord: number[],
    dimension: number,
    size: number[],
    neighborDirection: -1 | 1,
  ): number[] {
    const targetCoord = [...neighborCoord];

    if (neighborDirection === -1) {
      // Neighbor is BEFORE us, so we're at the start of our dimension
      targetCoord[dimension] = 0;
    } else {
      // Neighbor is AFTER us, so we're at the end of our dimension
      targetCoord[dimension] = size[dimension] - 1;
    }

    return targetCoord;
  }
}
