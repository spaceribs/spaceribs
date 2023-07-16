import { WangTileChunk } from '../chunk';

/**
 * Convert coordinate map to an ascii representation.
 * Only works for 2D chunks at the moment.
 * @param chunk - A chunk to render to ascii.
 * @returns An ascii based representation of the map.
 */
export const asciiDebug = (chunk: WangTileChunk<[number, number]>): string => {
  const asciiCoords = Array.from(chunk.coordMap)
    .reduce((memo, [coord, val]) => {
      if (memo[coord[1]] == null) {
        memo[coord[1]] = [];
      }
      if (
        chunk.active != null &&
        coord[0] === chunk.active[0] &&
        coord[1] === chunk.active[1]
      ) {
        memo[coord[1]][coord[0]] = '█';
      } else if (val instanceof Set) {
        memo[coord[1]][coord[0]] = '░';
      } else {
        memo[coord[1]][coord[0]] = val.toString();
      }
      return memo;
    }, [] as string[][])
    .map((strings) => strings.join(''));

  let blockDrawing = asciiCoords
    .reverse()
    .reduce((memo, string) => `${memo}\n${string}`, '');

  if (chunk.active != null) {
    blockDrawing += `\nActive: {${chunk.active[0]}, ${chunk.active[1]}}`;
  }

  return blockDrawing + '\n';
};
