import { WangTile } from './tile';
import { WangTileSet } from './tile-set';

/**
 * Configuration for propagating constraints from a placed tile to neighbors.
 */
export interface PropagationConfig<D extends number[]> {
  /** The coordinate of the neighbor tile */
  neighborCoord: D;
  /** The current set of possible tiles for the neighbor */
  neighborTiles: Set<WangTile<D>>;
  /** The tile that was just placed */
  placedTile: WangTile<D>;
  /** The dimension being propagated across (0 = x, 1 = y, etc.) */
  dimension: number;
  /** The offset direction (-1 or 1) */
  offset: -1 | 1;
  /** Current propagation depth to prevent infinite recursion */
  depth: number;
}

/**
 * Configuration for reducing tiles based on a single neighbor tile.
 */
export interface NeighborReductionConfig<D extends number[]> {
  /** The neighboring tile to use for constraint matching */
  tile: WangTile<D, unknown>;
  /** The available tileset to reduce */
  availableTiles: WangTileSet<D, unknown>;
  /** The number of dimensions in the coordinate space */
  dimensions: number;
  /** The specific dimension being evaluated */
  dimension: number;
  /** The offset direction from current position */
  offset: -1 | 1;
}

/**
 * Configuration for reducing tiles based on multiple neighbor tiles (OR logic).
 */
export interface NeighborEdgesReductionConfig<D extends number[]> {
  /** The neighboring tiles to use for constraint matching */
  tiles: WangTileSet<D>;
  /** The available tileset to reduce */
  availableTiles: WangTileSet<D, unknown>;
  /** The number of dimensions in the coordinate space */
  dimensions: number;
  /** The specific dimension being evaluated */
  dimension: number;
  /** The offset direction from current position */
  offset: -1 | 1;
}
