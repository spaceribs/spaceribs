/**
 * An array of tuples, the first value being the weight of
 * probability (higher is more probable), and the value
 * under the weight.
 * @template T - The type of the value being selected by weight.
 */
export type WeightedArray<T = unknown> = [number, T][];

/**
 * A PRNG seeded random number generator
 */
export class RandomGenerator implements IterableIterator<number> {
  private readonly rand: () => number;

  constructor(seed: string) {
    const hash = this.xmur3(seed);
    this.rand = this.sfc32(hash(), hash(), hash(), hash());
  }

  /**
   * Hash function for generating seeds from strings using xmur3.
   * {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
   * @param str - The string to generate a seed from.
   * @returns A function which returns a different number on each call.
   */
  private xmur3(str: string): () => number {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++)
      (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
        (h = (h << 13) | (h >>> 19));
    return () => {
      (h = Math.imul(h ^ (h >>> 16), 2246822507)),
        (h = Math.imul(h ^ (h >>> 13), 3266489909));
      return (h ^= h >>> 16) >>> 0;
    };
  }

  /**
   * "Small Fast Counter" seed generator, chosen for high bit randomness and speed.
   * {@link https://github.com/bryc/code/blob/master/jshash/PRNGs.md}
   * @param a - Seed Number 1
   * @param b - Seed Number 2
   * @param c - Seed Number 3
   * @param d - Seed Number 4
   * @returns A random seed.
   */
  private sfc32(a: number, b: number, c: number, d: number): () => number {
    return function () {
      a |= 0;
      b |= 0;
      c |= 0;
      d |= 0;
      const t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0;
      a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0;
      c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  /**
   * Generate a random number in for loops (infinitely)
   * @yields the next random number
   */
  *[Symbol.iterator](): IterableIterator<number> {
    yield this.rand();
  }

  /**
   * Get the next random number.
   * @returns the next random number.
   */
  public next(): IteratorResult<number, number> {
    return {
      done: false,
      value: this.rand(),
    };
  }

  /**
   * Get a random element from an array of possible elements based on weight.
   * @param possibleElements - A weighted array of elements to select randomly from.
   * @returns A random element from the weighted array.
   */
  public weightedRandom<T>(possibleElements: WeightedArray<T>): T {
    if (possibleElements.length < 1) {
      throw new Error('Possible elements are empty.');
    }

    const max = possibleElements.reduce((memo, [weight]) => memo + weight, 0);
    const rand = this.next().value;
    let pick = max * rand;
    const match = possibleElements.find(([weight]) => {
      if (pick <= weight) {
        return true;
      } else {
        pick -= weight;
        return false;
      }
    });

    if (match == null) {
      throw new Error('No match found.');
    }

    return match[1];
  }
}
