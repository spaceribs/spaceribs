import { Edge } from './edge';
import { WangTile } from './tile';

/**
 * A set of wang tiles allowed to be placed at a coordinate.
 * @template DataType - the type of value stored in all tiles in the set.
 */
export class WangTileSet<
  D extends number[] = number[],
  DataType = unknown,
> extends Set<WangTile<D, DataType>> {
  /**
   * Reduce the tiles by the constraint and return a new set.
   * @param edge - The edge to reduce by.
   * @param coords - The coordinates this edge applies to.
   * @returns A new tileset
   */
  public reduceByConstraint(edge: Edge, coords: D): WangTileSet<D, DataType> {
    const tiles = Array.from(this).filter((tile) => {
      const tileEdge = tile.edges.get(coords);
      return tileEdge === edge;
    });
    return new WangTileSet(tiles);
  }

  /**
   * Reduce the tiles by multiple constraints and return a new set.
   * @param edges - The edges to reduce by.
   * @param coords - The coordinates this edge applies to.
   * @returns A new tileset
   */
  public reduceByConstraints(
    edges: Edge[],
    coords: D,
  ): WangTileSet<D, DataType> {
    const tiles: WangTile<D, DataType>[] = [];

    for (let index = 0; index < edges.length; index++) {
      const edge = edges[index];
      const reduced = Array.from(this.reduceByConstraint(edge, coords));
      tiles.push(...reduced);
    }

    return new WangTileSet(tiles);
  }

  /**
   * Reduce the tiles by the constraint and return a new set.
   * @param edgeOrEdges - The edge or edges to reduce the set by.
   * @param dimensions - The number of dimensions
   * @param dimension - The dimension to get the offset on
   * @param offset - The amount of offset
   * @returns A new tileset
   */
  public reduceOffset(
    edgeOrEdges: Edge | Edge[],
    dimensions: number,
    dimension: number,
    offset: -1 | 1,
  ): WangTileSet<D, DataType> {
    const coords = new Array(dimensions).fill(0) as D;
    coords[dimension] = offset;

    if (Array.isArray(edgeOrEdges)) {
      return this.reduceByConstraints(edgeOrEdges, coords);
    } else {
      return this.reduceByConstraint(edgeOrEdges, coords);
    }
  }
}
