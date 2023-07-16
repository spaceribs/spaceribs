import { WangTile } from './tile';
import { CoordMap } from './coord-map';
import { WangTileSet } from './tile-set';
import { RandomGenerator, WeightedArray } from './prng';
import { Edge } from './edge';

/**
 * A chunk is a block of the dimension which can be used to
 * observe part of a tile generated world.
 */
export class WangTileChunk<
  D extends number[],
  V extends WangTileSet<D> | WangTile<D> = WangTileSet<D> | WangTile<D>
> {
  public observed = false;
  public active: D | null = null;
  public readonly coordMap: CoordMap<D, V>;

  private readonly center: D;

  constructor(
    private readonly tileset: Set<WangTile<D>>,
    private readonly random: RandomGenerator,
    chunkStart: D,
    chunkEnd: D
  ) {
    this.coordMap = new CoordMap<D, V>().fill(
      () => new Set(tileset) as V,
      chunkStart,
      chunkEnd
    );
    this.center = chunkStart.map((start, index) => {
      const end = chunkEnd[index];
      const diff = end - start;
      return start + Math.floor(diff / 2);
    }) as D;
  }

  /**
   * Observe the tiles until there are no unobserved tiles.
   * @yields
   */
  public *observe() {
    const centerTile = this.coordMap.get(this.center);

    // observe the center if still a set
    if (centerTile instanceof Set) {
      yield this.select(this.center);
    }

    // sort by size and observe the next smallest set.
    let nextSet;
    do {
      nextSet = this.findSmallestSet();
      if (nextSet != null) {
        this.active = nextSet[0];
        this.reduceAll();
        yield this.select(nextSet[0]);
      }
    } while (nextSet != null);

    this.active = null;

    // mark the chuck as observed and end iteration.
    this.observed = true;
    return;
  }

  /**
   * Select an element via weighted random at the coordinates.
   * @param coord - The coordinates to retrieve.
   * @returns the coordinate/tile pair that was set.
   */
  private select(coord: D): [D, WangTile<D>] {
    const elem = this.reduce(coord);

    if (elem instanceof WangTile) {
      this.coordMap.set(coord, elem);
      return [coord, elem];
    }

    const possibleElements: WeightedArray<WangTile<D>> = Array.from(elem).map(
      (tile) => [tile.probability, tile]
    );

    const tile = this.random.weightedRandom(possibleElements);
    this.coordMap.set(coord, tile as V);
    return [coord, tile];
  }

  /**
   * Find the smallest set in the coordinate map and return it, or null if no more sets exist.
   * @returns A coord/tileset pair or null
   */
  private findSmallestSet(): [D, WangTileSet<D>] | null {
    const sets: [D, WangTileSet<D>][] = Array.from(this.coordMap).filter(
      (coord) => coord[1] instanceof Set
    ) as [D, WangTileSet<D>][];

    if (sets.length < 1) {
      return null;
    }

    if (sets.length == 1) {
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
      } else if (beforeVal == null) {
        possibilities += this.tileset.size * 2;
      }

      if (afterVal instanceof WangTile) {
        possibilities -= this.tileset.size;
      } else if (afterVal instanceof Set) {
        possibilities += afterVal.size;
      } else if (beforeVal == null) {
        possibilities += this.tileset.size * 2;
      }
    }

    return possibilities;
  }

  /**
   * Reduce the possibilities of the entire chunk
   */
  private reduceAll(): void {
    // for (const [coord] of this.coordMap) {
    //   this.reduce(coord);
    // }
  }

  /**
   * Reduce the possibilities to a single tile.
   * @param coord - The coordinate to retrieve.
   * @returns A single, randomly selected tile from the set.
   */
  private reduce(coord: D): V {
    const elem = this.coordMap.get(coord);

    // Throw if coordinates are uninitialized.
    if (elem == null) {
      throw new Error('Coordinates are uninitialized or out of bounds.');
    }

    // Return if already observed.
    if (elem instanceof WangTile) {
      return elem;
    }

    // Throw if the set is empty.
    if (elem.size <= 0) {
      throw new Error('Tileset possibilities were empty.');
    }

    // Return if the set only has one possibility.
    if (elem.size <= 1) {
      return elem.values().next().value;
    }

    const neighbors = this.coordMap.getNeighbors(coord);

    let availableTiles = new WangTileSet(elem);

    for (let dimension = 0; dimension < coord.length; dimension++) {
      const [[beforeCoord, beforeVal], [afterCoord, afterVal]] =
        neighbors[dimension];

      if (beforeVal instanceof WangTile) {
        availableTiles = this.reduceByNeighborEdge(
          beforeVal,
          availableTiles,
          coord.length,
          dimension,
          1
        );
      } else if (beforeVal instanceof Set) {
        availableTiles = this.reduceByNeighborEdges(
          beforeVal,
          availableTiles,
          coord.length,
          dimension,
          1
        );
      }

      if (afterVal instanceof WangTile) {
        availableTiles = this.reduceByNeighborEdge(
          afterVal,
          availableTiles,
          coord.length,
          dimension,
          -1
        );
      } else if (afterVal instanceof Set) {
        availableTiles = this.reduceByNeighborEdges(
          afterVal,
          availableTiles,
          coord.length,
          dimension,
          -1
        );
      }

      if (availableTiles.size < 1) {
        throw new Error(
          `The coordinate {${coord.join()}} could not be resolved due to it's neighbors constraints at {${beforeCoord.join()}}:${beforeVal} and {${afterCoord.join()}}:${afterVal}`
        );
      }
    }

    if (availableTiles.size > 1) {
      const newTileset = new WangTileSet(availableTiles) as V;
      this.coordMap.set(coord, newTileset);
      return newTileset;
    } else {
      const newTile = availableTiles.values().next().value as V;
      this.coordMap.set(coord, newTile);
      return newTile;
    }
  }

  /**
   * Reduce a tileset by a neighboring tile.
   * @param tile - The neighboring tile
   * @param availableTiles - The tileset to reduce
   * @param dimensions - The number of dimensions
   * @param dimension - The dimension of the edge
   * @param offset - The offset from the position
   * @returns - A new tileset reduced by the neighboring tile.
   */
  private reduceByNeighborEdge(
    tile: WangTile<D, unknown>,
    availableTiles: WangTileSet<D, unknown>,
    dimensions: number,
    dimension: number,
    offset: -1 | 1
  ): WangTileSet<D, unknown> {
    const oppositeOffset = (offset * -1) as 1 | -1;
    const edge = tile.edges.getByOffset(dimensions, dimension, offset);

    if (edge != null) {
      availableTiles = availableTiles.reduceOffset(
        edge,
        dimensions,
        dimension,
        oppositeOffset
      );
    }
    return availableTiles;
  }

  /**
   * Reduce a tileset by a neighboring tile.
   * @param tiles - The neighboring tileset
   * @param availableTiles - The tileset to reduce
   * @param dimensions - The number of dimensions
   * @param dimension - The dimension of the edge
   * @param offset - The offset from the position
   * @returns - A new tileset reduced by the neighboring tile.
   */
  private reduceByNeighborEdges(
    tiles: WangTileSet<D>,
    availableTiles: WangTileSet<D, unknown>,
    dimensions: number,
    dimension: number,
    offset: -1 | 1
  ): WangTileSet<D, unknown> {
    let beforeEdges: Edge[] | null = null;

    for (const tile of tiles.values()) {
      const beforeEdge = tile.edges.getByOffset(dimensions, dimension, offset);

      if (beforeEdge != null) {
        if (beforeEdges == null) {
          beforeEdges = [];
        }
        beforeEdges.push(beforeEdge);
      }
    }

    if (beforeEdges != null) {
      return availableTiles.reduceOffset(
        beforeEdges,
        dimensions,
        dimension,
        -1
      );
    }

    return availableTiles;
  }

  /**
   * Convert coordinate map to a simple object for storage and testing.
   * @returns An object representing all coordinates in the map. Keys are comma delineated coordinates.
   */
  toJSON(): Record<string, V> {
    return this.coordMap.toJSON();
  }
}
