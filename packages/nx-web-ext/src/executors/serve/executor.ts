import { WebExtRunOptions, WebExtServeSchema } from './schema';
import * as webExt from 'web-ext';
import { resolve } from 'path';
import { Observable, Subscription } from 'rxjs';
import { ExecutorContext, logger, runExecutor } from '@nx/devkit';

interface BuildTargetResult {
  success: boolean;
  outputPath?: string;
  outfile?: string;
}

/**
 * Serve the web extension.
 * @param options - Raw options normalized by normalizeOptions()
 * @param context - Information about the project being served.
 * @returns An object indicating success or failure.
 */
const runServe = async (
  options: WebExtServeSchema,
  context: ExecutorContext
) => {
  let project: string;
  let target: string;
  let configuration: string;

  if (options.browserTarget != null) {
    [project, target, configuration] = options.browserTarget.split(':');
  } else if (options.buildTarget != null) {
    [project, target, configuration] = options.buildTarget.split(':');
  }

  let runnerSub: Subscription;

  for await (const s of await runExecutor<BuildTargetResult>(
    { project, target, configuration },
    { watch: true },
    context
  )) {
    if (s.success === true) {
      logger.info('Application built successfully.');

      const outputPath = s.outputPath || s.outfile.replace('main.js', '');

      if (runnerSub == null) {
        runnerSub = startWebExt(options.webExtOptions, outputPath).subscribe(
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
