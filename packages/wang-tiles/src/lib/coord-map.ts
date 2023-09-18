import { BeforeAfter } from './coord-map.models';

/**
 * An abstraction on Map which provides helper
 * functions and serialization for coordinate based
 * storage and lookup.
 */
export class CoordMap<D extends number[], V = unknown> implements Map<D, V> {
  /**
   * Allow CoordMap to be iterated on.
   * @yields
   */
  *[Symbol.iterator](): IterableIterator<[D, V]> {
    for (const coord of this.coords) {
      yield [this.decodeCoordinate(coord[0]), coord[1]];
    }
  }

  [Symbol.toStringTag] = `[object CoordMap]`;

  /**
   * Get the number of set coordinates.
   * @returns the number of items.
   */
  public get size() {
    return this.coords.size;
  }

  /**
   * Take an array of numbers representing coordinates and convert
   * them into a coordinate key.
   * @example
   * // returns "1,-2,3"
   * this.encodeCoordinate([1, -2, 3]);
   * @param coordinates - the coordinates to convert.
   * @returns A string storing the coordinates of the provided array.
   */
  private encodeCoordinate(coordinates: D): string {
    return coordinates.join(',');
  }

  /**
   * Take a stored coordinate key and convert them back into numbers.
   * @example
   * // returns [1, -2, 3]
   * this.decodeCoordinate("1,-2,3");
   * @param key - Joined and stringified coordinates.
   * @returns An array of numbers representing the coordinates.
   */
  private decodeCoordinate(key: string): D {
    const split = key.split(',');
    return split.map((val) => parseInt(val), 10) as D;
  }

  /**
   * Clear all elements from the coordinates.
   */
  clear(): void {
    this.coords.clear();
  }

  /**
   * Delete the element at the coordinate.
   * @param coordinates - The coordinates to delete from the space.
   * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
   */
  delete(coordinates: D): boolean {
    return this.coords.delete(this.encodeCoordinate(coordinates));
  }

  /**
   * Executes a provided function once per each key/value pair in the CoordMap, in insertion order.
   * @param callbackfn - The function to call over each element.
   * @param thisArg - the element representing `this`
   */
  forEach(
    callbackfn: (value: V, key: D, map: Map<D, V>) => void,
    thisArg?: unknown,
  ): void {
    this.coords.forEach((v: V, k: string) => {
      callbackfn(v, this.decodeCoordinate(k), this);
    }, thisArg);
  }

  /**
   * Determine if coordinates are set with a value.
   * @param coordinates - The coordinates to check.
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  has(coordinates: D): boolean {
    return this.coords.has(this.encodeCoordinate(coordinates));
  }

  /**
   * Returns an iterable of key, value pairs for every entry in the map.
   * @yields
   */
  *entries(): IterableIterator<[D, V]> {
    for (const coord of this.coords) {
      yield [this.decodeCoordinate(coord[0]), coord[1]];
    }
  }

  /**
   * Returns an iterable of key for every entry in the map.
   * @yields
   */
  *keys(): IterableIterator<D> {
    for (const coord of this.coords) {
      yield this.decodeCoordinate(coord[0]);
    }
  }

  /**
   * Returns an iterable of values for every entry in the map.
   * @yields
   */
  *values(): IterableIterator<V> {
    for (const coord of this.coords) {
      yield coord[1];
    }
  }

  private readonly coords: Map<string, V> = new Map();

  /**
   * Get the value at the provided point in space.
   * @param coordinates - The coordinates to retrieve from the space.
   * @returns the value stored at the point.
   */
  get(coordinates: D): V | undefined {
    return this.coords.get(this.encodeCoordinate(coordinates));
  }

  /**
   * Get the value at the provided offset.
   * @param dimensions - The number of dimensions
   * @param dimension - The dimension to get the offset
   * @param offset - The amount of offset
   * @returns the value stored at the offset
   */
  getByOffset(
    dimensions: number,
    dimension: number,
    offset: -1 | 1,
  ): V | undefined {
    const coords: D = new Array(dimensions).fill(0) as D;
    coords[dimension] = offset;
    return this.get(coords);
  }

  /**
   * Set the value at the provided point in space.
   * @param coordinates - The coordinates to set a value.
   * @param value - The value to set.
   * @returns this CoordMap instance.
   */
  set(coordinates: D, value: V): this {
    this.coords.set(this.encodeCoordinate(coordinates), value);
    return this;
  }

  /**
   * Get all the neighbors of a coordinate.
   * @param coordinates - The coordinates to convert.
   * @returns a tupled array of Dimensions, Before/After, and Coordinate/Value pairs.
   */
  public getNeighbors(coordinates: D): BeforeAfter<D, V>[] {
    return coordinates.map((coord, index) => {
      const beforeCoord = [...coordinates] as D;
      const afterCoord = [...coordinates] as D;

      beforeCoord[index] = coord - 1;
      afterCoord[index] = coord + 1;

      const before = this.get(beforeCoord);
      const after = this.get(afterCoord);

      return [
        [beforeCoord, before],
        [afterCoord, after],
      ];
    });
  }

  /**
   * Fill the CoordinateMap with a predefined value. Always square.
   * @param generator - Function returning a value to fill.
   * @param start - the minimum size of the area to fill.
   * @param end - the maximum size of the area to fill.
   * @returns this CoordMap instance.
   */
  public fill(generator: (coord: D) => V, start: D, end: D): this {
    this.recurseFill(generator, start, end);
    return this;
  }

  /**
   * Recursively fill the coordinates with the
   * @param generator - Function returning a value to fill.
   * @param start - the minimum size of the area to fill.
   * @param end - the maximum size of the area to fill.
   * @param state - the current coordinate state.
   */
  private recurseFill(
    generator: (coord: D) => V,
    start: D,
    end: D,
    state: number[] = [],
  ) {
    if (start.length === 0) {
      const val = generator(state as D);
      this.set(state as D, val);
    } else {
      const newStart = [...start] as D;
      const newEnd = [...end] as D;

      const startIndex = newStart.shift() || 0;
      const endIndex = newEnd.shift() || 0;

      for (let index = startIndex; index < endIndex; index++) {
        this.recurseFill(generator, newStart, newEnd, [...state, index]);
      }
    }
  }

  /**
   * Convert coordinate map to a simple object for storage and testing.
   * @returns An object representing all coordinates in the map. Keys are comma delineated coordinates.
   */
  toJSON(): Record<string, V> {
    const json: Record<string, V> = {};
    for (const [coord, val] of this.coords.entries()) {
      json[coord] = val;
    }
    return json;
  }
}
