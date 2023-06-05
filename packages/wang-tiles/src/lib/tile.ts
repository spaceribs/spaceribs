import { Constraint } from './constraint.models';
import { CoordMap } from './coord-map';
import { Edge } from './edge';

/**
 * A wang tile with a probability of appearing and constraints.
 */
export class WangTile<D extends number[], DataType = unknown> {
  public edges = new CoordMap<D, Edge>();

  constructor(
    private readonly data: DataType,
    public readonly probability: number = 1
  ) {}

  /**
   * Add an additional constraint to the tile's placement rules.
   * @param constraint - A new constraint.
   */
  public addConstraint(constraint: Constraint<D>) {
    this.edges.set(constraint.coords, constraint.edge);
  }

  /**
   * Return the string representation of the wang tile value
   * @returns a string representation of the data or undefined.
   */
  toString(): string {
    if (this.data != null) {
      return this.data.toString();
    }
    return 'undefined';
  }
}
