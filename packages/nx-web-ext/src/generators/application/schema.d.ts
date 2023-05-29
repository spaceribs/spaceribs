export interface NxWebExtGeneratorSchema {
  /**
   * Name of the new web extension
   */
  name: string;
  /**
   * Description of what the web extension does.
   */
  description?: string;
  /**
   * The application framework to initialize the project with.
   * Supports only `angular` and `react`, and defaults to `angular`.
   */
  framework: 'angular' | 'react';
}
