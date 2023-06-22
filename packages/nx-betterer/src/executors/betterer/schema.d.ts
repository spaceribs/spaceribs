/**
 * Valid modes for betterer to run as.
 */
export type BettererExecutorSchema =
  | BettererExecutorSchemaBase
  | BettererExecutorSchemaWatch
  | BettererExecutorSchemaUpdate;

interface BettererExecutorSchemaBase {
  watch?: false;
  update?: false;
}

interface BettererExecutorSchemaWatch {
  watch: true;
  update?: false;
}

interface BettererExecutorSchemaUpdate {
  watch?: false;
  update: true;
}
