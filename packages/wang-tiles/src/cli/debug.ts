import Debug from 'debug';
import { Command } from 'commander';

export const rootDebug = Debug('wang-tiles');

/**
 * Print issues with the CLI verbosely.
 * @param thisCommand - Command that was run.
 */
export const printVerboseHook = (thisCommand: Command) => {
  const options = thisCommand.opts();
  if (options['verbose'] === true) {
    Debug.enable('wang-tiles*');
    rootDebug(`CLI arguments`);
    rootDebug(options);
  }
};
