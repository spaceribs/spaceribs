/**
 * Valid modes for betterer to run as.
 */
export type BettererExecutorSchema =
  | BettererExecutorSchemaBase
  | BettererExecutorSchemaWatch
  | BettererExecutorSchemaUpdate;

interface BettererExecutorSchemaBase {
  watch?: false;
  forceUpdate?: false;
}

interface BettererExecutorSchemaWatch {
  watch: true;
  forceUpdate?: false;
}

interface BettererExecutorSchemaUpdate {
  watch?: false;
  forceUpdate: true;
}
