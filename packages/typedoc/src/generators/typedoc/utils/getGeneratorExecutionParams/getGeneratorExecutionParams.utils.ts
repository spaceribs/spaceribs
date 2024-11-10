/**
 *
 * @param lines
 */
export const throwError = (...lines: string[]) => {
  throw new Error(lines.join('\n.'));
};

/**
 *
 * @param target
 */
export const isNotObject = (target: unknown): boolean =>
  !target || typeof target !== 'object';

/**
 *
 * @param target
 */
export const isNotValidString = (target: unknown): boolean =>
  !target || typeof target !== 'string';

export const reviewNxVersion =
  'Check if there are any breaking changes nx package version used';

/**
 *
 * @param thing
 */
export const isMissingFromContext = (thing: string) =>
  `${thing} is missing from generator context`;

/**
 *
 * @param thing
 */
export const isMissingFromProjectConfig = (thing: string) =>
  `${thing} is missing from project configuration`;
