import { CustomHasher, Hash } from '@nrwl/devkit';
import { resolve } from 'path';

export const bettererHasher: CustomHasher = async (task, context) => {
  const hashTask = await context.hasher.hashTask(task);
  const bettererCachePath = resolve('tmp', task.projectRoot, '.betterer.cache');
  const hashFile = context.hasher.hashFile(bettererCachePath);

  const hash: Hash = {
    value: hashFile,
    details: hashTask.details,
  };

  return Promise.resolve(hash);
};

export default bettererHasher;
