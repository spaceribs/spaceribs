export interface WebExtRunOptions {
  /**
   * The directory where packages are copied to.
   */
  artifactsDir: string;
  /**
   * Show the browser console on startup
   */
  browserConsole: boolean;
  /**
   * Firefox preferences overrides.
   */
  pref?: {
    [key: string]: boolean | number | string;
  };
  /**
   * Location of firefox executable.
   */
  firefox: string;
  /**
   * Location of firefox user profile folder.
   */
  firefoxProfile?: string;
  /**
   * Array of files to ignore when building/watching/linting.
   */
  ignoreFiles?: Array<string>;
  /**
   * Persist user profile changes to disk.
   */
  keepProfileChanges: boolean;
  /**
   * Mark this session as non-interactive.
   */
  noInput?: boolean;
  /**
   * Turn off reloading when watching files.
   */
  noReload: boolean;
  /**
   * Used for older versions of firefox to preinstall your extension before running.
   */
  preInstall: boolean;
  /**
   * Directory where your application files will be built to.
   */
  sourceDir: string;
  /**
   * Watch additional files outside of the source directory.
   */
  watchFile?: string;
  /**
   * URL to navigate to on startup.
   */
  startUrl?: Array<string>;
  /**
   * Browser(s) to use for testing.
   */
  target?: Array<string>;
  /**
   * Arguments to pass to target browsers.
   */
  args?: Array<string>;

  // Android CLI options.

  /**
   * Executable for android's debugging instance.
   */
  adbBin?: string;
  /**
   * Remote hostname for an ADB socket.
   */
  adbHost?: string;
  /**
   * Remote port for an ADB socket.
   */
  adbPort?: string;

  /**
   * Remote target for ADB.
   */
  adbDevice?: string;

  /**
   * Time to wait for ADB's initial handshake to be successful.
   */
  adbDiscoveryTimeout?: number;

  /**
   * Application package to use for testing Firefox on Android.
   */
  firefoxApk?: string;

  /**
   * Custom view name to control on Android.
   */
  firefoxApkComponent?: string;

  // Chromium Desktop CLI options.

  /**
   * Path to custom chromium binary.
   */
  chromiumBinary?: string;

  /**
   * Path to custom chromium user profile.
   */
  chromiumProfile?: string;
}

/**
 *
 */
export interface WebExtServeSchema {
  /**
   * Nx project target to use when serving.
   */
  browserTarget?: string;

  /**
   * Nx project target to build when serving.
   */
  buildTarget?: string;

  /**
   * Additional options to pass to the web-ext cli when running.
   */
  webExtOptions: WebExtRunOptions;
}
