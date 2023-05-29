import { CustomHasher } from '@nx/devkit';

/**
 * Hash the betterer run to ensure it gets cached by nx appropriately.
 * @param task The task to cache.
 * @param context Information about the project being assessed.
 * @returns The hash representing any change being made to files or the task.
 */
export const bettererHasher: CustomHasher = async (task, context) => {
  const hashTask = await context.hasher.hashTask(task);
  return hashTask;
};

export default bettererHasher;
