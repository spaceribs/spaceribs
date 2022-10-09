export interface PackageExecutorSchema {
  sourceDir: string;
  artifactsDir: string;
}

export interface WebExtBuilderSchema extends JsonObject {
  sourceDir: string;
  artifactsDir: string;
  overwriteDest?: boolean;
}
