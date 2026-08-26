/**
 * web-ext ships no type declarations of its own, so describe the slice of its
 * CLI API that the serve and package executors use.
 */
declare module 'web-ext' {
  interface WebExtRunner {
    /** Connection details for the browser instance, when one is attached. */
    runningInfo?: { debuggerPort?: number };

    /**
     * Register a callback to run when the runner shuts down.
     * @param callback - Invoked once the extension stops running.
     */
    registerCleanup(callback: () => void): void;
  }

  interface WebExtBuildResult {
    /** Path of the zip archive that was written. */
    extensionPath: string;
  }

  interface WebExtMultiRunner {
    /** One runner per browser target the extension was launched in. */
    extensionRunners: WebExtRunner[];
  }

  export const cmd: {
    /**
     * Package a built extension into a zip archive.
     * @param params - `web-ext build` options.
     * @returns The path the archive was written to.
     */
    build(params: object): Promise<WebExtBuildResult>;

    /**
     * Launch the extension in a browser and watch it for changes.
     * @param params - `web-ext run` options.
     * @param options - Options controlling the runner's process behaviour.
     * @returns A runner covering every launched browser target.
     */
    run(params: object, options?: object): Promise<WebExtMultiRunner>;
  };
}
