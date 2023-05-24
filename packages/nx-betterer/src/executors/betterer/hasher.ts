import { CustomHasher } from '@nx/devkit';

export const bettererHasher: CustomHasher = async (task, context) => {
  const hashTask = await context.hasher.hashTask(task);
  return hashTask;
};

export default bettererHasher;
