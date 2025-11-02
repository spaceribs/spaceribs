import { Edge } from './edge';
import { WangTile } from './tile';
import { ConstraintCache } from './constraint-cache';

/**
 * A set of wang tiles allowed to be placed at a coordinate.
 * @template DataType - the type of value stored in all tiles in the set.
 */
export class WangTileSet<
  D extends number[] = number[],
  DataType = unknown,
> extends Set<WangTile<D, DataType>> {
  /** Static constraint cache shared across all tileset instances */
  private static constraintCache = new ConstraintCache();
  /**
   * Reduce the tiles by the constraint and return a new set.
   * @param edge - The edge to reduce by.
   * @param coords - The coordinates this edge applies to.
   * @returns A new tileset
   */
  public reduceByConstraint(edge: Edge, coords: D): WangTileSet<D, DataType> {
    // console.log(`🔍 [TILESET] reduceByConstraint: edge=${String(edge)}, coords=[${coords.join(',')}]`);
    // console.log(`🔍 [TILESET] Original tileset size: ${this.size}`);
    
    // Try to get cached result first
    const tilesArray = Array.from(this);
    const cachedResult = WangTileSet.constraintCache.getCachedResult(tilesArray, edge, coords);
    
    if (cachedResult !== null) {
      // console.log(`🚀 [TILESET] Cache HIT! Using cached result for edge=${String(edge)}, coords=[${coords.join(',')}]`);
      // console.log(`📊 [TILESET] Cached tileset size: ${cachedResult.length}`);
      // console.log(`🔍 [TILESET] Cached tiles:`, cachedResult.map(t => t.toString()));
      return new WangTileSet<D, DataType>(cachedResult);
    }
    
    // console.log(`💾 [TILESET] Cache MISS! Computing constraint for edge=${String(edge)}, coords=[${coords.join(',')}]`);
    
    const tiles = tilesArray.filter((tile) => {
      const tileEdge = tile.edges.get(coords);
      
      // If tile has no constraint for this edge, it's not compatible
      if (tileEdge === null) {
        return false;
      }
      
      const matches = tileEdge === edge;
      return matches;
    });
    
    // console.log(`📊 [TILESET] Filtered tileset size: ${tiles.length}`);
    // console.log(`🔍 [TILESET] Filtered tiles:`, tiles.map(t => t.toString()));
    
    // Cache the result for future use
    WangTileSet.constraintCache.setCachedResult(tilesArray, tiles, edge, coords);
    
    return new WangTileSet(tiles);
  }

  /**
   * Reduce the tiles by multiple constraints and return a new set.
   * Uses OR logic: tiles must be compatible with ANY of the provided edges.
   * This is used when a neighbor has multiple possible tiles (a Set).
   * @param edges - The edges to reduce by.
   * @param coords - The coordinates this edge applies to.
   * @returns A new tileset
   */
  public reduceByConstraints(
    edges: Edge[],
    coords: D,
  ): WangTileSet<D, DataType> {
    // console.log(`🔍 [TILESET] reduceByConstraints: edges=[${edges.map(e => String(e)).join(',')}], coords=[${coords.join(',')}]`);
    // console.log(`🔍 [TILESET] Original tileset size: ${this.size}`);
    
    // Try to get cached result first
    const tilesArray = Array.from(this);
    const cachedResult = WangTileSet.constraintCache.getCachedConstraintsResult(tilesArray, edges, coords);
    
    if (cachedResult !== null) {
      // console.log(`🚀 [TILESET] Cache HIT! Using cached result for edges=[${edges.map(e => String(e)).join(',')}], coords=[${coords.join(',')}]`);
      // console.log(`📊 [TILESET] Cached tileset size: ${cachedResult.length}`);
      // console.log(`🔍 [TILESET] Cached tiles:`, cachedResult.map(t => t.toString()));
      return new WangTileSet<D, DataType>(cachedResult);
    }
    
    // console.log(`💾 [TILESET] Cache MISS! Computing constraints for edges=[${edges.map(e => String(e)).join(',')}], coords=[${coords.join(',')}]`);
    
    // When we have multiple edges from a neighbor Set, we need to find tiles
    // that are compatible with ANY of those edges (OR logic), not ALL of them
    const tiles = tilesArray.filter((tile) => {
      const tileEdge = tile.edges.get(coords);
      
      // If tile has no constraint for this edge, it's not compatible
      if (tileEdge === null) {
        return false;
      }
      
      // Check if this tile's edge matches ANY of the neighbor's possible edges
      const matches = edges.some(edge => tileEdge === edge);
      return matches;
    });
    
    // console.log(`📊 [TILESET] Final result: ${tiles.length} tiles remain`);
    // console.log(`🔍 [TILESET] Filtered tiles:`, tiles.map(t => t.toString()));
    
    // Cache the result for future use
    WangTileSet.constraintCache.setCachedConstraintsResult(tilesArray, tiles, edges, coords);
    
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
    }
    return this.reduceByConstraint(edgeOrEdges, coords);
  }

  /**
   * Get constraint cache performance metrics
   * @returns The cache performance metrics
   */
  public static getCacheMetrics(): {
    totalLookups: number;
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    timeSaved: number;
    cacheSize: number;
    memoryUsage: number;
  } {
    return WangTileSet.constraintCache.getMetrics();
  }

  /**
   * Clear the constraint cache
   */
  public static clearCache(): void {
    WangTileSet.constraintCache.clear();
  }

  /**
   * Reset constraint cache metrics
   */
  public static resetCacheMetrics(): void {
    WangTileSet.constraintCache.resetMetrics();
  }
}
