import { Command } from 'commander';
import { printVerboseHook, rootDebug } from './debug';
import { WangTileChunk } from '../lib/chunk';
import { RandomGenerator } from '../lib/prng';
import { WangTile } from '../lib/tile';
import { WangTileSet } from '../lib/tile-set';
import { asciiDebug } from '../lib/util/ascii-debug';
import { Edge } from '../lib/edge';

const debug = rootDebug.extend('doSomething');

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a chunk from a tileset.
 * @returns the generate chunk command
 */
export const generateChunkCommand = () => {
  const command = new Command('generate-chunk');
  command
    .argument('[path]', 'Path to a defined tileset.')
    .option('--verbose', 'output debug logs', false)
    .hook('preAction', printVerboseHook)
    .action(async () => {
      // if (path && !fs.existsSync(path)) {
      //   debugError('invalid path provided');
      //   process.exit(1);
      // }

      debug(`Something important is happening now....`);

      const empty_edge: Edge = Symbol('empty_edge');
      const vert_line_edge: Edge = Symbol('vert_line_bottom_edge');
      const horiz_line_edge: Edge = Symbol('horiz_line_left_edge');

      const empty = new WangTile<[number, number]>(' ', 10);
      empty.addConstraint({ edge: empty_edge, coords: [1, 0] });
      empty.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      empty.addConstraint({ edge: empty_edge, coords: [0, 1] });
      empty.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const vert = new WangTile<[number, number]>('║');
      vert.addConstraint({ edge: empty_edge, coords: [1, 0] });
      vert.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      vert.addConstraint({ edge: vert_line_edge, coords: [0, 1] });
      vert.addConstraint({ edge: vert_line_edge, coords: [0, -1] });

      const horiz = new WangTile<[number, number]>('═');
      horiz.addConstraint({ edge: horiz_line_edge, coords: [1, 0] });
      horiz.addConstraint({ edge: horiz_line_edge, coords: [-1, 0] });
      horiz.addConstraint({ edge: empty_edge, coords: [0, 1] });
      horiz.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const topleft = new WangTile<[number, number]>('╔');
      topleft.addConstraint({ edge: horiz_line_edge, coords: [1, 0] });
      topleft.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      topleft.addConstraint({ edge: empty_edge, coords: [0, 1] });
      topleft.addConstraint({ edge: vert_line_edge, coords: [0, -1] });

      const topright = new WangTile<[number, number]>('╗');
      topright.addConstraint({ edge: empty_edge, coords: [1, 0] });
      topright.addConstraint({ edge: horiz_line_edge, coords: [-1, 0] });
      topright.addConstraint({ edge: empty_edge, coords: [0, 1] });
      topright.addConstraint({ edge: vert_line_edge, coords: [0, -1] });

      const bottomleft = new WangTile<[number, number]>('╚');
      bottomleft.addConstraint({ edge: horiz_line_edge, coords: [1, 0] });
      bottomleft.addConstraint({ edge: empty_edge, coords: [-1, 0] });
      bottomleft.addConstraint({ edge: vert_line_edge, coords: [0, 1] });
      bottomleft.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const bottomright = new WangTile<[number, number]>('╝');
      bottomright.addConstraint({ edge: empty_edge, coords: [1, 0] });
      bottomright.addConstraint({
        edge: horiz_line_edge,
        coords: [-1, 0],
      });
      bottomright.addConstraint({
        edge: vert_line_edge,
        coords: [0, 1],
      });
      bottomright.addConstraint({ edge: empty_edge, coords: [0, -1] });

      const tiles = new WangTileSet<[number, number]>([
        empty,
        vert,
        horiz,
        topleft,
        topright,
        bottomleft,
        bottomright,
      ]);

      const random = new RandomGenerator('foo');

      const chunk = new WangTileChunk<[number, number]>(
        tiles,
        random,
        [0, 0],
        [24, 24]
      );

      for (const _snapshot of chunk.observe()) {
        console.log('\x1b[2J');
        console.log(asciiDebug(chunk));
        await timeout(15);
      }
    });
  return command;
};
