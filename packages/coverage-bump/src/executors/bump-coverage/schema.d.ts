export interface BumpCoverageExecutorSchema {
  commit: string;
  margin: number;
  commitMessage?: string;
  coverageSummaryPath: string;
}
