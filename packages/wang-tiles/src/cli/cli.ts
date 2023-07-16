#! /usr/bin/env node

import { Command } from 'commander';
import { generateChunkCommand } from './generate-chunk';

const program = new Command();
program
  .name('Wang Tiles Debugger')
  .description('Generate a chunk to test a tileset.');

program.addCommand(generateChunkCommand());

program.parse(process.argv);
