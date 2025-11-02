import { WangTile } from './tile';
import { CoordMap } from './coord-map';
import { WangTileSet } from './tile-set';
import { RandomGenerator, WeightedArray } from './prng';
import { Edge } from './edge';
import { PropagationConfig, NeighborReductionConfig, NeighborEdgesReductionConfig } from './chunk.models';

/**
 * A chunk is a block of the dimension which can be used to
 * observe part of a tile generated world.
 */
export class WangTileChunk<
  D extends number[],
  V extends WangTileSet<D> | WangTile<D> = WangTileSet<D> | WangTile<D>,
> {
  public observed = false;
  private readonly coordMap: CoordMap<D, V>;
  private readonly center: D;
  private readonly iter: number;
  private active: D | null = null;

  constructor(
    private readonly tileset: Set<WangTile<D>>,
    private readonly random: RandomGenerator,
    chunkStart: D,
    chunkEnd: D,
  ) {
    this.coordMap = new CoordMap<D, V>().fill(
      () => new Set(tileset) as V,
      chunkStart,
      chunkEnd,
    );
    this.center = chunkStart.map((start, index) => {
      const end = chunkEnd[index];
      const diff = end - start;
      return start + Math.floor(diff / 2);
    }) as D;
    this.iter = this.center.reduce((memo: number, vec: number) => memo * vec, 1);
  }

  /**
   * Observe the tiles until there are no unobserved tiles.
   * @yields
   */
  public *observe(): Generator<D, void, unknown> {
    // Pre-reduce constraints across the chunk to avoid early contradictions
    this.reduceAll();

    const centerTile = this.coordMap.get(this.center);

    // observe the center if still a set
    if (centerTile instanceof Set) {
      yield this.select(this.center);
    }

    // sort by size and observe the next smallest set.
    let nextSet;
    do {
      nextSet = this.findSmallestSet();
      if (nextSet !== null) {
        const [activeCoord] = nextSet;
        this.active = activeCoord;
        // console.log(this.debug());
        yield this.select(nextSet[0]);
      }
    } while (nextSet !== null);

    this.active = null;
    // console.log(this.debug());

    // mark the chuck as observed and end iteration.
    this.observed = true;
  }

  /**
   * Select an element via weighted random at the coordinates.
   * @param coord - The coordinates to retrieve.
   * @returns the coordinate/tile pair that was set.
   */
  private select(coord: D): D {
    const elem = this.reduce(coord);

    if (elem instanceof WangTile) {
      this.coordMap.set(coord, elem);
      return coord;
    }

    const possibleElements: WeightedArray<WangTile<D>> = Array.from(elem).map(
      (tile) => [tile.probability, tile],
    );

    const tile = this.random.weightedRandom(possibleElements);
    this.coordMap.set(coord, tile as V);
    
    // Propagate constraints to neighbors immediately after placing a tile
    this.propagateConstraints(coord, tile);
    
    return coord;
  }

  /**
   * Propagate constraints from a newly placed tile to its neighbors.
   * This ensures that when a tile is placed, all its neighbors are immediately
   * updated with the new constraints, preventing impossible states.
   * @param coord - The coordinate where the tile was placed
   * @param tile - The tile that was placed
   * @param depth - Current propagation depth (used to prevent infinite recursion)
   */
  private propagateConstraints(coord: D, tile: WangTile<D>, depth = 0): void {
    const MAX_PROPAGATION_DEPTH = 10; // Configurable limit to prevent infinite recursion
    
    if (depth > MAX_PROPAGATION_DEPTH) {
      // Keep this warning for tests and debugging
      // eslint-disable-next-line no-console
      console.warn(
        `Propagation depth limit (${MAX_PROPAGATION_DEPTH}) reached at coordinate [${coord.join(',')}]. This may indicate circular dependencies in tile constraints.`,
      );
      return;
    }
    const neighbors = this.coordMap.getNeighbors(coord);
    
    for (let dimension = 0; dimension < coord.length; dimension++) {
      const [[beforeCoord, beforeVal], [afterCoord, afterVal]] = neighbors[dimension];
      
      // Propagate to the "before" neighbor (placed tile edge at -1, neighbor edge at +1)
      if (beforeCoord !== null && beforeVal instanceof Set) {
        this.propagateToNeighbor({
          neighborCoord: beforeCoord,
          neighborTiles: beforeVal,
          placedTile: tile,
          dimension,
          offset: -1,
          depth,
        });
      }
      
      // Propagate to the "after" neighbor (placed tile edge at +1, neighbor edge at -1)
      if (afterCoord !== null && afterVal instanceof Set) {
        this.propagateToNeighbor({
          neighborCoord: afterCoord,
          neighborTiles: afterVal,
          placedTile: tile,
          dimension,
          offset: 1,
          depth,
        });
      }
    }
  }

  /**
   * Propagate constraints from a placed tile to a specific neighbor.
   * @param config - Configuration containing neighbor coordinates, tiles, placed tile, and dimensions
   */
  private propagateToNeighbor(config: PropagationConfig<D>): void {
    const { neighborCoord, neighborTiles, placedTile, dimension, offset, depth } = config;
    
    const oppositeOffset = (offset * -1) as 1 | -1;
    const placedEdge = placedTile.edges.getByOffset(neighborCoord.length, dimension, offset);
    
    if (placedEdge !== null && placedEdge !== undefined) {
      const reducedTiles = this.reduceNeighborTiles(neighborTiles, placedEdge, neighborCoord.length, dimension, oppositeOffset);
      this.updateNeighborAndPropagate(neighborCoord, reducedTiles, neighborTiles, depth);
    }
  }

  /**
   * Reduce neighbor tiles based on placed edge
   * @param neighborTiles - The neighbor tiles to reduce
   * @param placedEdge - The edge that was placed
   * @param dimensions - The number of dimensions
   * @param dimension - The current dimension
   * @param oppositeOffset - The opposite offset direction
   * @returns A reduced tileset
   */
  private reduceNeighborTiles(
    neighborTiles: Set<WangTile<D>>,
    placedEdge: Edge,
    dimensions: number,
    dimension: number,
    oppositeOffset: 1 | -1,
  ): WangTileSet<D> {
    return new WangTileSet(neighborTiles).reduceOffset(
      placedEdge,
      dimensions,
      dimension,
      oppositeOffset,
    );
  }

  /**
   * Update neighbor and continue propagation if needed
   * @param neighborCoord - The coordinate of the neighbor
   * @param reducedTiles - The reduced tileset
   * @param originalTiles - The original tileset
   * @param depth - Current propagation depth
   */
  private updateNeighborAndPropagate(
    neighborCoord: D,
    reducedTiles: WangTileSet<D>,
    originalTiles: Set<WangTile<D>>,
    depth: number,
  ): void {
    if (reducedTiles.size !== originalTiles.size) {
      this.coordMap.set(neighborCoord, reducedTiles as V);
      
      if (reducedTiles.size === 1) {
        const singleTile = reducedTiles.values().next().value;
        if (singleTile !== null && singleTile !== undefined) {
          this.coordMap.set(neighborCoord, singleTile as V);
          this.propagateConstraints(neighborCoord, singleTile, depth + 1);
        }
      }
    }
  }

  /**
   * Find the smallest set in the coordinate map and return it, or null if no more sets exist.
   * @returns A coord/tileset pair or null
   */
  private findSmallestSet(): [D, WangTileSet<D>] | null {
    const sets: [D, WangTileSet<D>][] = Array.from(this.coordMap).filter(
      (coord) => coord[1] instanceof Set,
    ) as [D, WangTileSet<D>][];

    if (sets.length < 1) {
      return null;
    }

    if (sets.length === 1) {
      return sets[0];
    }

    return sets.sort((a, b) => {
      return (
        this.getPossibilitiesCount(a[0]) - this.getPossibilitiesCount(b[0])
      );
    })[0];
  }

  /**
   * Get the number for possibilities for a coordinate via count.
   * @param coord - The coordinate to calculate.
   * @returns the count of possibilities for a coordinate.
   */
  private getPossibilitiesCount(coord: D): number {
    const neighbors = this.coordMap.getNeighbors(coord);

    let possibilities = 0;

    for (let dimension = 0; dimension < coord.length; dimension++) {
      const [[, beforeVal], [, afterVal]] = neighbors[dimension];

      if (beforeVal instanceof WangTile) {
        possibilities -= this.tileset.size;
      } else if (beforeVal instanceof Set) {
        possibilities += beforeVal.size;
      } else if (beforeVal === null) {
        possibilities += this.tileset.size * 2;
      }

      if (afterVal instanceof WangTile) {
        possibilities -= this.tileset.size;
      } else if (afterVal instanceof Set) {
        possibilities += afterVal.size;
      } else if (afterVal === null) {
        possibilities += this.tileset.size * 2;
      }
    }

    return possibilities;
  }

  /**
   * Reduce the possibilities of the entire chunk
   */
  private reduceAll(): void {
    for (let index = 0; index < this.iter; index++) {
      for (const [coord] of this.coordMap) {
        this.reduce(coord);
      }
    }
  }

  /**
   * Reduce the possibilities to a single tile.
   * @param coord - The coordinate to retrieve.
   * @returns A single, randomly selected tile from the set.
   */
  private reduce(coord: D): V {
    const elem = this.coordMap.get(coord);
    
    // Handle early returns and validation
    const validatedElem = this.validateAndGetElement((elem as V) ?? null);
    if (validatedElem !== null && validatedElem !== undefined) {
      return validatedElem;
    }

    // If validatedElem is null or undefined, we need to process the element
    if (elem === null) {
      throw new Error('Coordinates are uninitialized or out of bounds.');
    }

    // Process neighbors and reduce possibilities
    const availableTiles = this.processNeighborsAndReduce(coord, elem as Set<WangTile<D>>);
    
    // Return the final result
    return this.finalizeReduction(coord, availableTiles);
  }

  /**
   * Validate element and handle early returns
   * @param elem - The element to validate
   * @returns The validated element or null if processing should continue
   */
  private validateAndGetElement(elem: V | null): V | null | undefined {
    if (elem === null) {
      throw new Error('Coordinates are uninitialized or out of bounds.');
    }

    if (elem instanceof WangTile) {
      return elem;
    }

    if (elem.size <= 0) {
      throw new Error('Tileset possibilities were empty.');
    }

    if (elem.size <= 1) {
      return (elem.values().next().value as V);
    }

    return null; // Continue processing
  }

  /**
   * Process all neighbors and reduce tile possibilities
   * @param coord - The coordinate being processed
   * @param elem - The element to process
   * @returns A reduced tileset based on neighbor constraints
   */
  private processNeighborsAndReduce(coord: D, elem: Set<WangTile<D>>): WangTileSet<D, unknown> {
    const neighbors = this.coordMap.getNeighbors(coord);
    let availableTiles = new WangTileSet(elem);

    for (let dimension = 0; dimension < coord.length; dimension++) {
      const [[beforeCoord, beforeVal], [afterCoord, afterVal]] = neighbors[dimension];
      
      
      // Process before neighbor
      availableTiles = this.processNeighbor(
        beforeVal ?? null,
        availableTiles,
        coord.length,
        dimension,
        -1,
      );

      // Process after neighbor
      availableTiles = this.processNeighbor(
        afterVal ?? null,
        availableTiles,
        coord.length,
        dimension,
        1,
      );

      // Validate reduction result
      this.validateReductionResult(coord, availableTiles, beforeCoord, beforeVal ?? null, afterCoord, afterVal ?? null);
    }

    return availableTiles;
  }

  /**
   * Process a single neighbor (either WangTile or Set)
   * @param neighborVal - The neighbor value (tile, set, or null)
   * @param availableTiles - The available tiles to reduce
   * @param dimensions - The number of dimensions
   * @param dimension - The current dimension
   * @param offset - The offset direction
   * @returns A reduced tileset
   */
  private processNeighbor(
    neighborVal: WangTile<D, unknown> | Set<WangTile<D>> | null,
    availableTiles: WangTileSet<D, unknown>,
    dimensions: number,
    dimension: number,
    offset: -1 | 1,
  ): WangTileSet<D, unknown> {
    
    if (neighborVal instanceof WangTile) {
      const result = this.reduceByNeighborEdge({
        tile: neighborVal,
        availableTiles,
        dimensions,
        dimension,
        offset,
      });
      return result;
    } else if (neighborVal instanceof Set) {
      const result = this.reduceByNeighborEdges({
        tiles: new WangTileSet(neighborVal),
        availableTiles,
        dimensions,
        dimension,
        offset,
      });
      return result;
    }
    return availableTiles;
  }

  /**
   * Validate that reduction didn't eliminate all possibilities
   * @param coord - The coordinate being validated
   * @param availableTiles - The available tiles after reduction
   * @param beforeCoord - The before neighbor coordinate
   * @param beforeVal - The before neighbor value
   * @param afterCoord - The after neighbor coordinate
   * @param afterVal - The after neighbor value
   */
  private validateReductionResult(
    coord: D,
    availableTiles: WangTileSet<D, unknown>,
    beforeCoord: D | null,
    beforeVal: WangTile<D, unknown> | Set<WangTile<D>> | null,
    afterCoord: D | null,
    afterVal: WangTile<D, unknown> | Set<WangTile<D>> | null,
  ): void {
    if (availableTiles.size < 1) {
      throw new Error(
        `The coordinate {${coord.join()}} could not be resolved due to it's neighbors constraints at {${beforeCoord?.join() ?? 'null'}}:${String(beforeVal)} and {${afterCoord?.join() ?? 'null'}}:${String(afterVal)}`,
      );
    }
  }

  /**
   * Finalize the reduction by setting the result and returning it
   * @param coord - The coordinate being finalized
   * @param availableTiles - The available tiles
   * @returns The finalized tile or tileset
   */
  private finalizeReduction(coord: D, availableTiles: WangTileSet<D, unknown>): V {
    if (availableTiles.size > 1) {
      const newTileset = new WangTileSet(availableTiles.values()) as V;
      this.coordMap.set(coord, newTileset);
      return newTileset;
    }

    const newTile = availableTiles.values().next().value;
    if (newTile !== null) {
      this.coordMap.set(coord, newTile as V);
      return newTile as V;
    }
    throw new Error('No tile available for finalization');
  }

  /**
   * Reduce a tileset by a neighboring tile.
   * @param config - Configuration containing the neighboring tile, available tiles, and dimensions
   * @returns A new tileset reduced by the neighboring tile.
   */
  private reduceByNeighborEdge(config: NeighborReductionConfig<D>): WangTileSet<D, unknown> {
    const { tile, availableTiles, dimensions, dimension, offset } = config;
    const oppositeOffset = (offset * -1) as 1 | -1;
    const edge = tile.edges.getByOffset(dimensions, dimension, oppositeOffset);

    if (edge !== null && edge !== undefined) {
      // Match OUR edge on the side facing the neighbor, which is `offset`
      const reduced = availableTiles.reduceOffset(edge, dimensions, dimension, offset);
      return reduced;
    }
    return availableTiles;
  }

  /**
   * Reduce a tileset by a neighboring tile.
   * @param config - Configuration containing neighboring tiles, available tiles, and dimensions
   * @returns A new tileset reduced by the neighboring tiles.
   */
  private reduceByNeighborEdges(config: NeighborEdgesReductionConfig<D>): WangTileSet<D, unknown> {
    const { tiles, availableTiles, dimensions, dimension, offset } = config;
    const beforeEdges = this.collectEdgesFromTiles(tiles, dimensions, dimension, offset);

    if (beforeEdges !== null) {
      // Match OUR edge on the side facing the neighbor, which is `offset`
      return availableTiles.reduceOffset(beforeEdges, dimensions, dimension, offset);
    }

    return availableTiles;
  }

  /**
   * Collect edges from tiles for a specific dimension and offset
   * @param tiles - The tiles to collect edges from
   * @param dimensions - The number of dimensions
   * @param dimension - The current dimension
   * @param offset - The offset direction
   * @returns An array of edges or null if none found
   */
  private collectEdgesFromTiles(
    tiles: WangTileSet<D>,
    dimensions: number,
    dimension: number,
    offset: -1 | 1,
  ): Edge[] | null {
    let edges: Edge[] | null = null;

    for (const tile of tiles.values()) {
      const edge = tile.edges.getByOffset(dimensions, dimension, (offset * -1) as 1 | -1);
      if (edge !== null && edge !== undefined) {
        edges ??= [];
        edges.push(edge);
      }
    }

    return edges;
  }

  /**
   * Public API: Constrain a coordinate's possibilities based on a known neighbor tile
   * that exists outside of this chunk's bounds.
   * This is useful to enforce cross-chunk boundary consistency before observation.
   * @param coord - The coordinate inside this chunk to constrain
   * @param neighborTile - The tile that is placed in the neighboring chunk
   * @param dimension - The axis index of the edge to match (0 for x, 1 for y, ...)
   * @param neighborOffset - Relative side of the neighbor (-1 before, 1 after)
   */
  public applyBoundaryConstraint(
    coord: D,
    neighborTile: WangTile<D>,
    dimension: number,
    neighborOffset: -1 | 1,
  ): void {
    const current = this.coordMap.get(coord);
    if (current instanceof WangTile || current === null) {
      return;
    }

    const constrained = this.reduceByNeighborEdge({
      tile: neighborTile,
      availableTiles: new WangTileSet(current as Set<WangTile<D>>),
      dimensions: coord.length,
      dimension,
      offset: neighborOffset,
    });

    if (constrained.size === 1) {
      const only = constrained.values().next().value;
      if (only !== null && only !== undefined) {
        this.coordMap.set(coord, only as V);
        this.propagateConstraints(coord, only, 0);
        return;
      }
    }

    this.coordMap.set(coord, constrained as V);
  }

  /**
   * Convert coordinate map to a simple object for storage and testing.
   * @returns An object representing all coordinates in the map. Keys are comma delineated coordinates.
   */
  toJSON(): Record<string, V> {
    return this.coordMap.toJSON();
  }

  /**
   * Convert coordinate map to an ascii representation.
   * Only works for 2D chunks at the moment.
   * @returns An ascii based representation of the map.
   */
  debug(): string {
    const asciiCoords = Array.from(this.coordMap)
      .reduce((memo: string[][], [coord, val]) => {
        memo[coord[1]] ??= [];
        if (
          this.active !== null &&
          coord[0] === this.active[0] &&
          coord[1] === this.active[1]
        ) {
          memo[coord[1]][coord[0]] = '█';
        } else if (val instanceof Set) {
          memo[coord[1]][coord[0]] = '░';
        } else {
          memo[coord[1]][coord[0]] = val.toString();
        }
        return memo;
      }, [] as string[][])
      .map((strings) => strings.join(''));

    let blockDrawing = asciiCoords
      .reverse()
      .reduce((memo, string) => `${memo}\n${string}`, '');

    if (this.active !== null) {
      blockDrawing += `\nActive: {${this.active[0]}, ${this.active[1]}}`;
    }

    return `${blockDrawing}\n`;
  }
}
