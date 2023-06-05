import { Edge } from './edge';

/**
 * A whitelist of what tiles are allowed to abut
 * another tile.
 */
export interface Constraint<D extends number[]> {
  /**
   * The tile allowed to be placed.
   */
  edge: Edge;

  /**
   * The axis of the allowed placement, if the tileset is a 3D matrix for instance:
   * X-Axis = 0, Y-Axis = 1, Z-Axis = 2
   */
  coords: D;
}
