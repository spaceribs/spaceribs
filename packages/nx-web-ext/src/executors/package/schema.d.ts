export interface PackageExecutorSchema {
  /**
   * Path of source files to package.
   */
  sourceDir: string;
  /**
   * Path where package should be sent to.
   */
  artifactsDir: string;
}

export interface WebExtBuilderSchema extends JsonObject {
  /**
   * Path of source files to package.
   */
  sourceDir: string;
  /**
   * Path where package should be sent to.
   */
  artifactsDir: string;
  /**
   * Overwrite any existing files.
   */
  overwriteDest?: boolean;
}
