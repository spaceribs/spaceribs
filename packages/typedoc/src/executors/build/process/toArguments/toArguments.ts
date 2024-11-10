import { BuildExecutorSchema } from '../../schema';

/**
 *
 * @param options
 */
export const toArguments = (options: BuildExecutorSchema): string[] =>
  Object.entries(options)
    .filter(([, value]) => !!value)
    .reduce((args, [key, value]) => {
      let arg = `--${key}`;
      if (typeof value !== 'boolean') arg += ` ${value}`;
      return [...args, arg];
    }, []);
