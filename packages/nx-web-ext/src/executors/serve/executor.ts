import { WebExtRunOptions, WebExtServeSchema } from './schema';
import * as webExt from 'web-ext';
import { resolve } from 'path';
import { Observable, Subscription } from 'rxjs';
import { ExecutorContext, logger, runExecutor } from '@nrwl/devkit';

interface BuildTargetResult {
  success: boolean;
  outputPath: string;
}

const runServe = async (
  options: WebExtServeSchema,
  context: ExecutorContext
) => {
  const [project, target, configuration] = options.browserTarget.split(':');
  let runnerSub: Subscription;

  for await (const s of await runExecutor<BuildTargetResult>(
    { project, target, configuration },
    { watch: true },
    context
  )) {
    if (s.success === true) {
      console.log(s.outputPath);

      logger.info('Application built successfully.');

      if (runnerSub == null) {
        runnerSub = startWebExt(options.webExtOptions, s.outputPath).subscribe(
          () => {
            logger.info('WebExt started successfully.');
          },
          (err) => {
            runnerSub = null;
            throw err;
          },
          () => {
            throw new Error('WebExt closed.');
          }
        );
      }
    } else {
      logger.error(s);
      if (runnerSub != null) {
        runnerSub.unsubscribe();
        runnerSub = null;
      }
      throw new Error('Application failed to build.');
    }
  }

  return { success: true };
};

const startWebExt = (webExtOptions: WebExtRunOptions, sourceDir: string) => {
  return new Observable((observer) => {
    webExt.cmd
      .run(
        {
          ...webExtOptions,
          sourceDir: resolve(sourceDir),
        },
        {
          shouldExitProgram: false,
        }
      )
      .then((res) => {
        if (res.extensionRunners && res.extensionRunners.length <= 0) {
          throw new Error('No instances running the extension.');
        }

        if (res.extensionRunners[0].runningInfo != null) {
          console.log(
            'Debugger Port: ',
            res.extensionRunners[0].runningInfo.debuggerPort
          );
        }

        res.extensionRunners[0].registerCleanup(() => {
          observer.next({ success: true });
          observer.complete();
        });
      })
      .catch((err) => {
        observer.error(err);
      });
  });
};

export default runServe;
