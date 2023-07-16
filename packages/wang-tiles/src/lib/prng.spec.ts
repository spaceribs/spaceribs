import { RandomGenerator, WeightedArray } from './prng';

describe('RandomGenerator', () => {
  describe('next', () => {
    it('should convert seeds into a pseudorandom number.', () => {
      const rand = new RandomGenerator('testing');
      expect(rand.next().value).toMatchInlineSnapshot(`0.41248386655934155`);
      expect(rand.next().value).toMatchInlineSnapshot(`0.289362900191918`);
      expect(rand.next().value).toMatchInlineSnapshot(`0.30122436326928437`);
      expect(rand.next().value).toMatchInlineSnapshot(`0.3438316425308585`);
    });
  });

  describe('weightedRandom()', () => {
    it('can use weighted randoms from a prng generator.', () => {
      const rand = new RandomGenerator('tester');
      const elemSet: WeightedArray = [
        [1, 'foo'],
        [1, 'bar'],
        [1, 'bat'],
        [1, 'boo'],
        [1, 'far'],
      ];
      const result1 = rand.weightedRandom(elemSet);
      const result2 = rand.weightedRandom(elemSet);
      const result3 = rand.weightedRandom(elemSet);
      expect(result1).toMatchInlineSnapshot(`"bat"`);
      expect(result2).toMatchInlineSnapshot(`"bat"`);
      expect(result3).toMatchInlineSnapshot(`"boo"`);
    });

    it('can pick only the most likely.', () => {
      const rand = new RandomGenerator('tester');
      const elemSet: WeightedArray = [
        [1, 'foo'],
        [1, 'bar'],
        [1, 'bat'],
        [1, 'boo'],
        [100, 'far'],
      ];
      const result1 = rand.weightedRandom(elemSet);
      const result2 = rand.weightedRandom(elemSet);
      const result3 = rand.weightedRandom(elemSet);
      expect(result1).toMatchInlineSnapshot(`"far"`);
      expect(result2).toMatchInlineSnapshot(`"far"`);
      expect(result3).toMatchInlineSnapshot(`"far"`);
    });

    it('can return an error if no element in array.', () => {
      const rand = new RandomGenerator('tester');
      const elemSet: WeightedArray = [];
      expect(() => {
        rand.weightedRandom(elemSet);
      }).toThrowErrorMatchingInlineSnapshot(`"Possible elements are empty."`);
    });
  });
});
