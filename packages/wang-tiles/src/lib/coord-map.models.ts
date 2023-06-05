/**
 * A tuple of the coordinates and the value at the coordinate.
 */
export type Pairs<D, V> = [D, V | undefined];

/**
 * For a particular axis, a tuple representing the element before
 * and after
 */
export type BeforeAfter<D, V> = [Pairs<D, V>, Pairs<D, V>];
